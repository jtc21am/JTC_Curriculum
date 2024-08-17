// navbar.js

document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    console.log('DOM fully loaded and parsed');

    if (navbarPlaceholder) {
        console.log('Navbar placeholder found');
        
        fetch('navbar.html')
            .then(response => {
                console.log('Fetch response status:', response.status);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('Navbar HTML content:', data);
                navbarPlaceholder.innerHTML = data;
                initAuth0(); // Initialize Auth0 after navbar is loaded
                console.log('Navbar content injected and Auth0 initialized');
            })
            .catch(error => console.error('Error loading navbar:', error));
    } else {
        console.error('Navbar placeholder not found');
    }
});

function initAuth0() {
    console.log('Initializing Auth0');
    if (typeof auth0 !== 'undefined') {
        auth0.createAuth0Client({
            domain: 'dev-gkgncylqchbqob52.us.auth0.com',
            clientId: 'toUxIMe4zjdTVnYoeqM9RS7MyOpbetBS',
            authorizationParams: {
                redirect_uri: window.location.origin + '/callback',
                useRefreshTokens: true,
                cacheLocation: 'localstorage'
            }
        }).then(auth0Client => {
            window.auth0Client = auth0Client; // Make it accessible globally
            console.log('Auth0 client initialized:', auth0Client);
            setupEventListeners(auth0Client);
            auth0Client.isAuthenticated().then(isAuthenticated => {
                console.log('User is authenticated:', isAuthenticated);
                updateUI(isAuthenticated);
            });
        }).catch(error => console.error('Error initializing Auth0:', error));
    } else {
        console.error('Auth0 is undefined');
    }
}

function setupEventListeners(auth0Client) {
    console.log('Setting up event listeners');
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            auth0Client.loginWithRedirect();
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth0Client.logout({
                returnTo: window.location.origin, // Use dynamic logout URL
            });
        });
    }
}

function updateUI(isAuthenticated) {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    const userInfoSection = document.getElementById('user-info');
    const loginMessage = document.getElementById('login-message');

    if (isAuthenticated) {
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (userInfoSection) userInfoSection.style.display = 'block';
        if (loginMessage) loginMessage.style.display = 'none';

        // Load user info if the element exists
        if (userInfoSection) {
            loadUserInfo();
        }
    } else {
        if (loginButton) loginButton.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (userInfoSection) userInfoSection.style.display = 'none';
        if (loginMessage) loginMessage.style.display = 'block';
    }
}

async function loadUserInfo() {
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        const user = await window.auth0Client.getUser();
        userInfoElement.textContent = `Hello, ${user.name}`;
    }
}
