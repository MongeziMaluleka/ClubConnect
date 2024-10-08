const form = document.querySelector('form');

const reportWordCount = () => {
    const characterCount = document.getElementById('char-current')
    const testimonial = document.getElementById('testimonial');
    const numberOfCharacters = testimonial.value.length;
    characterCount.firstChild.textContent = numberOfCharacters;
    if (numberOfCharacters > 485){
        characterCount.style.color = 'brown';
    } else{
        characterCount.style.color = 'inherit';
    }
    console.log(testimonial.value.length);
}

const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validateForm();
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

const validateForm = () => {
    // get form fields
    const testimonial = document.getElementById('testimonial');
    const name = document.getElementById('name');
    const image = document.getElementById('image');

    let isValid = true;
    const errorMessagesMap = {
        testimonial: '',
        name: '',
        image: '',
    };

    // validate testimonial character count
    if (testimonial.value.length < 30) {
        errorMessagesMap.testimonial = 'Testimonial must at least be 30 characters.';
        isValid = false;
    }

    // validate name field: should be filled in
    if(!name.value.trim()) {
        errorMessagesMap.name = 'Name is required.';
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

