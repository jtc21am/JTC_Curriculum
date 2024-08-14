// admin.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    if (typeof auth0 === 'undefined') {
        console.error('Auth0 library not loaded. Admin functionality will be limited.');
        displayErrorMessage({ message: 'Authentication library not loaded. Some features may be unavailable.' });
    } else {
        initAdminPage();
    }
});

async function initAdminPage() {
    try {
        const auth0Client = await auth0.createAuth0Client({
            domain: 'dev-gkgncylqchbqob52.us.auth0.com',
            clientId: 'toUxIMe4zjdTVnYoeqM9RS7MyOpbetBS',
            authorizationParams: {
                redirect_uri: window.location.origin + '/callback'
            }
        });

        const isAuthenticated = await auth0Client.isAuthenticated();
        if (isAuthenticated) {
            const user = await auth0Client.getUser();
            if (user && user.email === 'admin@example.com') {  // Replace with actual admin email
                displayAdminDashboard();
            } else {
                displayUnauthorizedMessage();
            }
        } else {
            displayLoginMessage();
        }
    } catch (error) {
        console.error('Error initializing admin page:', error);
        displayErrorMessage(error);
    }
}

function displayAdminDashboard() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <h2>Admin Dashboard</h2>
        <div id="userManagement">