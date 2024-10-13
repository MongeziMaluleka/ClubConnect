const form = document.querySelector('form');

const validateUsername = async (username) => {
    const options = {
        method: 'GET',
    };
    try{
        const response = await fetch(`http://localhost:5000/validate-username/${username}`, options);
        if (!response.ok) {
            throw new Error(`Username ${username} not found, status: ${response.statusText}`);
        }
        return response.ok;
    } catch (error) {
        console.error('Error validating username:', error);
        return false; 
    }

};

const reportWordCount = (currentCharacterCountId, testimonialItemId, wordCountThreshold) => {
    const characterCount = document.getElementById(currentCharacterCountId);
    const testimonial = document.getElementById(testimonialItemId);
    const numberOfCharacters = testimonial.value.length;
    characterCount.textContent = `${numberOfCharacters}/${wordCountThreshold}`; // Corrected this line
    if (numberOfCharacters > wordCountThreshold - 15) {
        characterCount.style.color = 'brown';
    } else {
        characterCount.style.color = 'inherit';
    }
    console.log(testimonial.value.length);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = await validateForm();
    const formSubmissionReport = document.getElementById('report-form-submission-outcome');
    if (isValid){
        const formData = new FormData(form);
        const url = form.action;

        // send the form data to the url
        fetch(url, {
            method:form.method,
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Form data submitted successfully:', data);
            formSubmissionReport.innerText = "Testimonial uploaded successfully!"
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            formSubmissionReport.innerText = "Testimonial upload was unsuccessful. Try again later.";
        })
    }

}

form.addEventListener('submit', handleSubmit);

const validateForm = async () => {
    // get form fields
    const testimonial = document.getElementById('testimonial');
    const tagline = document.getElementById('tagline');
    const username = document.getElementById('username');
    const name = document.getElementById('name');
    const image = document.getElementById('image');

    let isValid = true;
    const errorMessagesMap = {
        testimonial: '',
        tagline: '',
        username: '',
        name: '',
        image: '',
    };

    // validate testimonial character count
    if (testimonial.value.length < 30) {
        errorMessagesMap.testimonial = 'Testimonial must at least be 30 characters.';
        isValid = false;
    }

    // validate tagline character count
    if (tagline.value.length < 30) {
        errorMessagesMap.tagline = 'Tagline must at least be 30 characters.';
        isValid = false;
    }

    // validate name field: should be filled in
    if(!name.value.trim()) {
        errorMessagesMap.name = 'Name is required.';
        isValid = false;
    }

    const username_value = username.value;
    console.log(username_value);
    // validate username field: should be filled in and should be valid
    if(!username_value.trim() || !(await validateUsername(username_value))) {
        errorMessagesMap.username = 'A valid WeThinkCode username is required.';
        isValid = false;
    }

    // validate image field: there should be at least one image of supported format
    if (!image.files.length) {
        errorMessagesMap.image = 'Image is required';
        isValid = false;
    }

    // Display error messages
    for (const fieldName in errorMessagesMap) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        errorElement.textContent = errorMessagesMap[fieldName];
        errorElement.style.display = errorMessagesMap[fieldName] ? 'block' : 'none';
    }

    return isValid;

};

