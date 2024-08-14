let auth0Client = null;

async function initializeAuth0() {
    try {
        console.log("Initializing Auth0...");
        
        auth0Client = await auth0.createAuth0Client({
            domain: 'dev-gkgncylqchbqob52.us.auth0.com',
            clientId: 'toUxIMe4zjdTVnYoeqM9RS7MyOpbetBS',
            authorizationParams: {
                redirect_uri: window.location.origin + '/callback'
            },
            cacheLocation: 'localstorage'
        });
        console.log("Auth0 client initialized successfully.");

        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            try {
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('Error handling Auth0 callback:', error.message, error.stack);
            }
        }

        const isAuthenticated = await auth0Client.isAuthenticated();
        localStorage.setItem('isAuthenticated', isAuthenticated);
        console.log("Is user authenticated?", isAuthenticated);
        
        updateUIState(isAuthenticated);

        if (isAuthenticated) {
            const user = await auth0Client.getUser();
            localStorage.setItem('user', JSON.stringify(user));
            console.log("User profile:", user);
            showUserProfile(user);
        }

        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isAuthenticated } }));
    } catch (error) {
        console.error('Error during Auth0 initialization:', error.message, error.stack);
    }
}

function updateUIState(isAuthenticated) {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');

    if (isAuthenticated) {
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        if (loginButton) loginButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

function showUserProfile(user) {
    const profileElement = document.getElementById('profile');
    if (profileElement) {
        profileElement.innerHTML = `
            <h2>User Profile</h2>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
        `;
    }
}

async function login() {
    try {
        console.log('Login button clicked');
        await auth0Client.loginWithRedirect();
    } catch (error) {
        console.error('Error during login:', error.message, error.stack);
    }
}

async function logout() {
    try {
        console.log('Logout button clicked');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        await auth0Client.logout({
            returnTo: window.location.origin
        });
    } catch (error) {
        console.error('Error during logout:', error.message, error.stack);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAuth0();

    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');

    if (loginButton) loginButton.addEventListener('click', login);
    if (logoutButton) logoutButton.addEventListener('click', logout);
});

window.login = login;
window.logout = logout;