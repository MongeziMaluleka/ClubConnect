from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials  # Correct import for service account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load environment variables from .env file
load_dotenv()


# Scopes specify the level of access the application is requesting
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def authenticate_drive():
    """Authenticates and returns a Google Drive API service instance using a service account."""
    # Path to the service account key file
    SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')

    # Create credentials using the service account file
    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
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
        file_metadata = {'name': os.path.basename(file_path)}
        media = MediaFileUpload(file_path, mimetype='application/octet-stream')

        # Upload the file to Google Drive
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        
        print(f"Uploaded to Drive, File ID: {file.get('id')}")
        return file.get('id')
    except Exception as e:
        print(f"An error occurred while uploading to Drive: {e}")
        return None  # Return None or handle it as you see fit


@app.route('/submit', methods=['POST'])
def submit_testimonial():
    if 'testimonial' not in request.form or 'name' not in request.form:
        return jsonify({"error": "Testimonial and Name are required."}), 400

    # extract name and testimonial text
    testimonial = request.form['testimonial']
    name = request.form['name']

    # handle image uploads
    images = request.files.getlist('image')  
    uploaded_images = []

    for image in images:
        if image and image.filename:
            filepath = os.path.join(UPLOAD_FOLDER, image.filename)
            image.save(filepath) 
            uploaded_images.append(filepath)
            print(f"Saved file to: {filepath}")
            # Upload each image to Google Drive
            upload_file_to_drive(filepath)

    return jsonify({
        "message": "Testimonial submitted successfully!",
        "data": {
            "testimonial": testimonial,
            "name": name,
            "uploaded_images": uploaded_images
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True)