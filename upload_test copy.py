from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
import os

# Path to your service account key file
SERVICE_ACCOUNT_FILE = './service-key.json'
TESTIMONIAL_SERVICE_KEY = './testimonial-service.json'

# Scopes
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def authenticate_drive():
    """Authenticates and returns a Google Drive API service instance using a service account."""
    creds = Credentials.from_service_account_file(
        TESTIMONIAL_SERVICE_KEY,
        scopes=SCOPES
    )
    service = build('drive', 'v3', credentials=creds)
    return service

def upload_file_to_drive(file_path):
    """Uploads a file to Google Drive."""
    service = authenticate_drive()

    # Create a media file upload instance
    file_metadata = {'name': os.path.basename(file_path), 'parents':['1aSrb6XUge091IME5ltIcZCd_UIjcsWCS']}
    media = MediaFileUpload(file_path, mimetype='application/octet-stream', resumable=True)

    # Upload the file to Google Drive
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"File uploaded successfully! File ID: {file.get('id')}")
    print(f"Full response: {file}")

if __name__ == '__main__':
    # Specify the path to the file you want to upload
    file_to_upload = '.\\backend\\uploads\\girlfwendz.jpg'
    upload_file_to_drive(file_to_upload)
