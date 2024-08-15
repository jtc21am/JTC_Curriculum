// client.js

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Wait until auth0Client is available
        let auth0Client;
        while (!window.auth0Client) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
            auth0Client = window.auth0Client;
        }

        // Handle the Auth0 redirect callback
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
            console.log('Handling Auth0 callback...');
            try {
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname); // Clean the URL
            } catch (err) {
                console.error('Error during Auth0 callback handling:', err);
            }
        }

        // Check if the user is authenticated
        const isAuthenticated = await auth0Client.isAuthenticated();
        console.log('Is user authenticated?', isAuthenticated);

        updateUI(isAuthenticated); // Call the existing updateUI function
    } catch (error) {
        console.error('Error during Auth0 client usage:', error);
    }
});
