// const Queue = require('./queue'); // Import the Queue class

function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
    });
}

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
                    imageUrl: testimonialMetaData.uploaded_images && testimonialMetaData.uploaded_images.length > 0
                        ? `https://drive.google.com/thumbnail?id=${testimonialMetaData.uploaded_images[0].imageId}`
                        : 'https://drive.google.com/thumbnail?id=1vI7JBJYij-FxEAzA5VRM_30hv3bASSTo'
                };

                testimonialsArray.push(finalData);
                console.log(finalData);
            }

            // Preload images before rendering
            Promise.all(testimonialsArray.map(testimonial => preloadImage(testimonial.imageUrl)))
                .then(() => {
                    const template = document.getElementById('testimonial-template').innerText;
                    const compiledFunction = Handlebars.compile(template);
                    const resultsHTML = compiledFunction({ testimonials: testimonialsArray.slice().reverse() });

                    const newbiesElement = document.getElementById('new-testimonials');
                    if (newbiesElement) {
                        newbiesElement.innerHTML = resultsHTML;                         // ensure newbies exist before accessing or attempting to reassign
                    }
                })
                .catch(error => {
                    console.error('Error loading images:', error);
                });
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


