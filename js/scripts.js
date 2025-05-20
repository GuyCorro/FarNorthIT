document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init('f7_0ydDfbD0xlEesp');

    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formMessage.textContent = '';

            // Get the service ID from the form's data attribute
            const serviceId = form.getAttribute('data-service-id');
            
            emailjs.sendForm(serviceId, 'template_abroe0k', form)
                .then(function() {
                    formMessage.textContent = 'Thank you for reaching out! We will get back to you soon.';
                    formMessage.style.color = '#4CAF50';
                    form.reset();
                })
                .catch(function(error) {
                    console.error('EmailJS Error:', error);
                    formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                    formMessage.style.color = '#f44336';
                })
                .finally(function() {
                    // Re-enable submit button and restore original text
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                });
        });
    }
}); 