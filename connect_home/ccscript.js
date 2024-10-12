// const Queue = require('./queue'); // Import the Queue class

function renderTestimonials() {
    const options = {
        method: 'GET',
    };

    // Fetch testimonial data via API
    fetch('http://localhost:5000/new-testimonials', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(responseData => {
            const data = responseData.data;

            // Check if data exists
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No testimonials found');
            }

            const testimonialsArray = [];
            let resultsHTML = '';
            for (let i = 0; i < data.length; ++i) {
                const testimonialMetaData = data[i];
                const finalData = {
                    name: testimonialMetaData.name,
                    testimonial: testimonialMetaData.testimonial,
                    tagline: testimonialMetaData.tagline,
                    imageUrl: `https://drive.google.com/uc?id=${testimonialMetaData.uploaded_images[0].imageId}` 
                };

                testimonialsArray.push(finalData);
                console.log(finalData);
            }

            // Compile Handlebars template for each testimonial
            const template = document.getElementById('testimonial-template').innerText;
            const compiledFunction = Handlebars.compile(template);
            resultsHTML += compiledFunction({ testimonials: testimonialsArray.slice().reverse()});

            // Check if the target element exists before setting innerHTML
            const newbiesElement = document.getElementById('new-testimonials');
            console.log(newbiesElement);
            if (newbiesElement) {
                newbiesElement.innerHTML = resultsHTML;
            } else {
                console.error("Element with ID 'new-testimonials' not found.");
            }
        })
        .catch(error => {
            // Log error and provide user feedback
            console.error('Error fetching testimonials:', error);
            // Optionally display an error message to the user
            const newbiesElement = document.getElementById('new-testimonials');
            if (newbiesElement) {
                newbiesElement.innerHTML = '<p class="error">Failed to load testimonials. Please try again later.</p>';
            }
        });
}


// tag::router[]
window.addEventListener('DOMContentLoaded', () => {
    // Compile and render the dynamic testimonial section
    const dynamicTemplate = Handlebars.compile($('#dynamic-testimonial').html());
    const dynamicHTML = dynamicTemplate();
    console.log('dynamoooooo??', dynamicHTML);
    const app = $('#new-testimonials');
    app.html(dynamicHTML); // Ensure 'newbies' exists in the DOM

    // Now that the section is rendered, you can safely call renderTestimonials
    renderTestimonials();
  
});