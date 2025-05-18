document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('f7_0ydDfbD0xlEesp'); // Public key

    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            emailjs.sendForm('service_q57almf', 'template_abroe0k', form)
                .then(function() {
                    formMessage.textContent = 'Thank you for reaching out! We will get back to you soon.';
                    form.reset();
                }, function(error) {
                    formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                });
        });
    }
}); 