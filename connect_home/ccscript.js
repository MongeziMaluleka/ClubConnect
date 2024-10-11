function renderTestimonials(){
    const options = {
        method: 'GET',
      };

    // fetch testimonial data via api
    fetch('https://localhost:5000/new-testimonials', options).then(response => response.json())
    .then(data => {
        let resultsHTML = '';
        for(let i=0; i <data.length; ++i){
            const testimonialMetaData = data[i];
            
            // compile handlebars template for each testimonial
            const template = document.getElementById('dynamic-testimonials').innerText;
            const compiledFunction = Handlebars.compile(template);
            resultsHTML += compiledFunction(testimonialMetaData);
        }

        document.getElementById('newbies').innerHTML = resultsHTML;
    })


}