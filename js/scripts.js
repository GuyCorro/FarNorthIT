document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formMessage.textContent = '';

            try {
                // Get form data
                const formData = new FormData(form);
                const emailData = {
                    name: formData.get('name'),
                    contact: formData.get('contact'),
                    time: formData.get('time'),
                    message: formData.get('message')
                };

                // Send to backend API
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.success) {
                    formMessage.textContent = 'Thank you for reaching out! We will get back to you soon.';
                    formMessage.style.color = '#4CAF50';
                    form.reset();
                } else {
                    throw new Error(result.error || 'Failed to send email');
                }
            } catch (error) {
                console.error('Email sending error:', error);
                formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                formMessage.style.color = '#f44336';
            } finally {
                // Re-enable submit button and restore original text
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }
}); 