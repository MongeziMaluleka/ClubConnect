from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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