var isValid  = false;

const form = document.querySelector('form');

const modal = document.getElementById('exampleModal');
const formMultiStep = document.querySelector("[testimonial-multi-step]");
const formSteps = [...document.querySelectorAll("[testimonial-step]")];

let currentStep = 0; // Initialize current step

const errorMessagesMap = {
    testimonial: '',
    tagline: '',
    username: '',
    name: '',
    image: '',
};

const getFormInputElementById = (elementId) => {
    return document.getElementById(elementId);
}

modal.addEventListener('show.bs.modal', () => {
    currentStep = 0; // Reset to first step
    showCurrentStep(); // Show the first step when modal opens
});

formMultiStep.addEventListener("click", event => {
    if (event.target.matches("[testimonial-next]")) {
        currentStep += 1;
    } else if (event.target.matches("[testimonial-back]")) {
        currentStep -= 1;
    }
    showCurrentStep(); // Update the view after changing steps
});

function showCurrentStep() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });
}



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

const validateName = (name) => {
    // validate name field: should be filled in
    if(!name.value.trim()) {
        errorMessagesMap.name = 'Name is required.';
        isValid = false;
    } else {
        errorMessagesMap.name = '';
        isValid = true;
    }

}

const validate = async (fieldName) => {
    switch(fieldName){
        case 'username':
            const username_value = getFormInputElementById(fieldName).value;
            console.log(username_value);
            // validate username field: should be filled in and should be valid
            if(!username_value.trim() ||!(await validateUsername(username_value))) {
                errorMessagesMap.username = 'A valid WeThinkCode username is required.';
                isValid = false;
            } else {
                errorMessagesMap.username = '';
                isValid = true;
            }
            console.log(errorMessagesMap.username);
            console.log(username_value+' is valid? : '+`${isValid}`)
            console.log(isValid ? 'valid username!': 'invalid username!' );
            displayErrorMessage(fieldName);            
        case 'name':
            validateName(getFormInputElementById(fieldName));
            console.log(isValid ? 'valid name!': 'invalid name!' );
            console.log(isValid)
            displayErrorMessage(fieldName);
        case 'tagline': 
            // validate tagline character count
            if (getFormInputElementById('tagline').value.length < 30) {
                errorMessagesMap.tagline = 'Tagline must at least be 30 characters.';
                isValid = false;
            } else {
                errorMessagesMap.tagline = '';
                isValid = true;
            }
            console.log(isValid ? 'valid tagline!': 'invalid tagline!' );
            console.log(isValid)
            displayErrorMessage(fieldName);
    }
}

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
    // validate tagline character count
    if (testimonial.value.length < 30) {
        errorMessagesMap[testimonialItemId] = `${capitalize(testimonialItemId)} must at least be 30 characters.`;
        isValid = false;
    } else {
        errorMessagesMap[testimonialItemId] = '';
        isValid = true;
    }
    displayErrorMessage(testimonialItemId);
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

const getTestimonial = () => document.getElementById('testimonial');
const getTagline = () => document.getElementById('tagline');
const getUsername = () => document.getElementById('username');
const getName = () => document.getElementById('name');
const getImage = () => document.getElementById('image');



const validateForm = async () => {
    // get form fields
    const testimonial = getFormInputElementById('testimonial');
    const tagline = getFormInputElementById('tagline');
    const username = getFormInputElementById('username');
    const name = getFormInputElementById('name');
    const image = getFormInputElementById('image');

    let isValid = true;
    

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

const displayErrorMessage = (fieldName) => {
    const errorElement = getFormInputElementById(`${fieldName}-error`);
    const inputArea = getFormInputElementById(fieldName);
    errorElement.textContent = errorMessagesMap[fieldName];
    console.log('this is what you should see: '+errorElement.textContent);
    errorElement.style.display = errorMessagesMap[fieldName] ? 'block' : 'none';
    inputArea.classList.toggle('error-focus', !isValid);

}

