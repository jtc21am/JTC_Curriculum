document.addEventListener('DOMContentLoaded', async function() {
    const app = document.getElementById('app');
    
    // HTML for the Contact Us & Suggestions form
    app.innerHTML = `
        <h1>Contact Us & Suggestions</h1>
        <div id="contact-form" style="display: none;">
            <form id="suggestion-form">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                    <label for="message" class="form-label">Message or Suggestion</label>
                    <textarea class="form-control" id="message" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
        <div id="login-message">
            <p>Please log in to access the contact form and submit suggestions.</p>
        </div>
    `;

    const contactForm = document.getElementById('contact-form');
    const loginMessage = document.getElementById('login-message');
    const suggestionForm = document.getElementById('suggestion-form');

    async function updateContactFormDisplay() {
        // Wait until auth0Client is available
        let auth0Client;
        while (!window.auth0Client) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
            auth0Client = window.auth0Client;
        }

        const isAuthenticated = await auth0Client.isAuthenticated();
        console.log('Is authenticated:', isAuthenticated);

        if (isAuthenticated) {
            contactForm.style.display = 'block';
            loginMessage.style.display = 'none';
        } else {
            contactForm.style.display = 'none';
            loginMessage.style.display = 'block';
        }
    }

    updateContactFormDisplay();

    window.addEventListener('authStateChanged', async () => {
        await updateContactFormDisplay();
    });

    if (suggestionForm) {
        suggestionForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // Example POST request to send form data to your server
                const response = await fetch('/api/submit-suggestion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert('Thank you for your suggestion!');
                suggestionForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to submit your suggestion. Please try again.');
            }
        });
    }
});
