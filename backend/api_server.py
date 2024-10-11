from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials  # Correct import for service account
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
    """Authenticates and returns a Google Drive API service instance using a service account."""
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
    """Uploads a file to Google Drive."""
    try:
        # Authenticate and get the Drive service
        service = authenticate_drive()

        # Create a media file upload instance
        file_metadata = {
            'name': os.path.basename(file_path), 
            'parents':['1aSrb6XUge091IME5ltIcZCd_UIjcsWCS']
            }
        media = MediaFileUpload(file_path, mimetype='application/octet-stream')

        # Upload the file to Google Drive
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        
        print(f"Uploaded to Drive, File ID: {file.get('id')}")
        return file.get('id')
    except Exception as e:
        print(f"An error occurred while uploading to Drive: {e}")
        return None  # Return None or handle it as you see fit

def extract_testimonial_data():
    return APP_SERVICE_PROVIDER.read_testimonial_data_from_json()

def persist_testimonial_data_to_json(data):
    APP_SERVICE_PROVIDER.write_testimonial_data_to_json(data)

@app.route('/new-testimonials', methods=['POST'])
def render_new_testimonials():
    data = extract_testimonial_data()
    return jsonify({'message': 'successfully fetched testimonial data', 'data': data}), 201


@app.route('/submit-testimonial', methods=['POST'])
def submit_testimonial():
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
            images_id_to_path_map_collection.append(
                {
                    "image_file_name": os.path.basename(filepath),
                    "imageId": upload_file_to_drive(filepath)
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