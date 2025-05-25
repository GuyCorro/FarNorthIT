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

    // Hero background slideshow
    const bgImages = [
        'assets/images/2025-05-21.jpg',
        'assets/images/2025-05-21 (1).jpg',
        'assets/images/2025-05-21 (2).jpg'
    ];
    const heroBg = document.querySelector('.hero-bg-slideshow');
    if (heroBg) {
        bgImages.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            if (idx === 0) img.classList.add('active');
            heroBg.appendChild(img);
        });
        let current = 0;
        setInterval(() => {
            const imgs = heroBg.querySelectorAll('img');
            imgs[current].classList.remove('active');
            current = (current + 1) % imgs.length;
            imgs[current].classList.add('active');
        }, 5000);
    }
}); 