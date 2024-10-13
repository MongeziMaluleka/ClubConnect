from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials  # import for service account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import ClubConnect

app = Flask(__name__)
CORS(app)

APP_SERVICE_PROVIDER = ClubConnect.ClubConnect()

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load environment variables from .env file
load_dotenv()

# Scopes specify the level of access the application is requesting
SCOPES = ['https://www.googleapis.com/auth/drive.file']


def authenticate_drive():
    """
    Authenticates and returns a Google Drive API service instance using a service account.

    This function reads the service account credentials from the environment variable
    `TESTIMONIAL_SERVICE_KEY` and uses it to create a Google Drive API client with the
    specified scopes.

    Returns:
        googleapiclient.discovery.Resource: An authorized Google Drive API client instance.
    """

    # Path to the service account key file
    TESTIMONIAL_SERVICE_KEY = os.getenv('TESTIMONIAL_SERVICE_KEY')

    # Create credentials using the service account file
    creds = Credentials.from_service_account_file(
        TESTIMONIAL_SERVICE_KEY,
        scopes=SCOPES
    )

    # Build the Google Drive API service
    service = build('drive', 'v3', credentials=creds)
    return service


def upload_file_to_drive(file_path):
    """
    Uploads a file to Google Drive and sets its permissions to be publicly accessible.

    This function uses the authenticated Google Drive API client to upload a file, sets the
    file's metadata including the folder to upload to, and updates permissions to make the
    file accessible to anyone with the link.

    Args:
        file_path (str): The local path of the file to be uploaded.

    Returns:
        tuple: A tuple containing the web view link and file ID of the uploaded file. Returns None if an error occurs.
    """
    try:
        # Authenticate and get the Drive service
        service = authenticate_drive()

        # Create a media file upload instance
        file_metadata = {
            'name': os.path.basename(file_path),
            'parents': ['1aSrb6XUge091IME5ltIcZCd_UIjcsWCS']
        }
        media = MediaFileUpload(file_path, mimetype='application/octet-stream')

        # Upload the file to Google Drive
        file = service.files().create(body=file_metadata, media_body=media,
                                      fields='id, webViewLink, webContentLink').execute()

        # Update permissions to make the file accessible
        permission_body = {
            'role': 'reader',
            'type': 'anyone',
        }
        service.permissions().create(fileId=file.get('id'), body=permission_body).execute()

        print(f"Uploaded to Drive, File ID: {file.get('id')}", file.get('webViewLink'), sep="\n")
        return file.get('webViewLink'), file.get('id')  # Return the webViewLink or webContentLink
    except Exception as e:
        print(f"An error occurred while uploading to Drive: {e}")
        return None  # Handle errors as needed


def extract_testimonial_data():
    """
        Extracts testimonial data using the ClubConnect service provider.

        This function reads the testimonials stored in a JSON file using a method from the
        ClubConnect service.

        Returns:
            dict: A dictionary containing the extracted testimonial data.
    """
    return APP_SERVICE_PROVIDER.read_testimonial_data_from_json()


def persist_testimonial_data_to_json(data):
    """
        Persists testimonial data to a JSON file using the ClubConnect service provider.

        This function writes the given testimonial data to a JSON file using a method from the
        ClubConnect service.

        Args:
            data (dict): The data to be written to the JSON file.
    """
    APP_SERVICE_PROVIDER.write_testimonial_data_to_json(data)


@app.route('/validate-username/<username>', methods=['GET'])
def validate_username(username):
    """
        Checks if the username supplied is valid and returns a JSON response.

        This route extracts WTC student username data from the JSON file and looks for a matching username
        It returns a JSON response with a success message if a match is found or an error message otherwise.

        Returns:
            flask.Response: A JSON response containing username validation outcome.
    """
    valid_usernames = APP_SERVICE_PROVIDER.load_valid_cohort_23_usernames_from_json()

    error_username_not_found_response = {'result': 'error', 'message': f'"{username}" is not a valid WeThinkCode username.' }
    ok_username_exists_response = {'result': 'ok', 'message': f'"{username}" is a valid WeThinkCode username.'}
    response = (ok_username_exists_response, 200) if username in valid_usernames else (error_username_not_found_response, 404)
    print(response)
    return response

@app.route('/new-testimonials', methods=['GET'])
def render_new_testimonials():
    """
        Fetches and returns all testimonials as a JSON response.

        This route extracts testimonial data from the JSON file and returns it to the client
        with a success message.

        Returns:
            flask.Response: A JSON response containing the testimonial data.
    """
    data = extract_testimonial_data()
    return jsonify({'message': 'successfully fetched testimonial data', 'data': data}), 201


@app.route('/submit-testimonial', methods=['POST'])
def submit_testimonial():
    """
        Handles the submission of a new testimonial.

        This route accepts form data containing a testimonial, tagline, username, name, and optional images.
        It saves images locally, uploads them to Google Drive, and stores the testimonial data in a JSON file.

        Returns:
            flask.Response: A JSON response indicating success or failure of the submission, along with the submitted data.
    """
    if 'testimonial' not in request.form or 'name' not in request.form:
        return jsonify({"error": "Testimonial and Name are required."}), 400

    # extract name and testimonial text
    testimonial = request.form['testimonial']
    tagline = request.form['tagline']
    username = request.form['username']
    name = request.form['name']

    # handle image uploads
    images = request.files.getlist('image')
    images_id_to_path_map_collection = []

    for image in images:
        if image and image.filename:
            filepath = os.path.join(UPLOAD_FOLDER, image.filename)
            image.save(filepath)
            print(f"Saved file to: {filepath}")
            # Upload each image to Google Drive and generate a map of its details
            image_url, image_id = upload_file_to_drive(filepath)
            images_id_to_path_map_collection.append(
                {
                    "image_file_name": os.path.basename(filepath),
                    "imageId": image_id,
                    "imageUrl": image_url
                })
    #     prepare data for json body and persistence
    data = {
        "testimonial": testimonial,
        "tagline": tagline,
        "username": username,
        "name": name,
        "uploaded_images": images_id_to_path_map_collection
    }

    persist_testimonial_data_to_json(data)

    return jsonify({
        "message": "Testimonial submitted successfully!",
        "data": data
    }), 200


if __name__ == '__main__':
    app.run(debug=True)
