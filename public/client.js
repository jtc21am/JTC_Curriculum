// // let auth0 = null;

// async function initializeAuth0() {
//     try {
//         if (!window.auth0 || !window.auth0.createAuth0Client) {
//             throw new Error('Auth0 SDK failed to load or is not available');
//         }

//         console.log('Initializing Auth0 client...');

//         auth0 = await auth0.createAuth0Client({
//             domain: 'dev-gkgncylqchbqob52.us.auth0.com',
//             clientId: 'toUxIMe4zjdTVnYoeqM9RS7MyOpbetBS',
//             authorizationParams: {
//                 redirect_uri: window.location.origin
//             }
//         });

//         console.log('Auth0 client initialized successfully');
        
//         await handleAuthentication();
//     } catch (error) {
//         console.error('Error during Auth0 initialization:', error.message, error.stack);
//     }
// }

// async function handleAuthentication() {
//     const isAuthenticated = await auth0.isAuthenticated();

//     if (isAuthenticated) {
//         console.log('User is authenticated');
//         const user = await auth0.getUser();
//         showProfile(user);
//     } else {
//         console.log('User is not authenticated, checking for redirect...');
//         if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
//             await auth0.handleRedirectCallback();
//             const user = await auth0.getUser();
//             showProfile(user);
//             window.history.replaceState({}, document.title, "/");
//         } else {
//             updateUI(false);
//         }
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const loginButton = document.getElementById('login');
//     const logoutButton = document.getElementById('logout');

//     if (loginButton) {
//         loginButton.addEventListener('click', async () => {
//             try {
//                 console.log('Attempting login with redirect');
//                 await auth0.loginWithRedirect();
//             } catch (error) {
//                 console.error('Error during login:', error.message, error.stack);
//             }
//         });
//     } else {
//         console.error('Login button not found');
//     }

//     if (logoutButton) {
//         logoutButton.addEventListener('click', () => {
//             try {
//                 console.log('Attempting logout');
//                 auth0.logout({
//                     returnTo: window.location.origin
//                 });
//                 hideProfile();
//             } catch (error) {
//                 console.error('Error during logout:', error.message, error.stack);
//             }
//         });
//     } else {
//         console.error('Logout button not found');
//     }

//     // Initialize Auth0
//     initializeAuth0();
// });

// function showProfile(user) {
//     document.getElementById('profile').style.display = 'block';
//     document.getElementById('profile-data').textContent = JSON.stringify(user, null, 2);
//     updateUI(true);
// }

// function hideProfile() {
//     document.getElementById('profile').style.display = 'none';
//     document.getElementById('profile-data').textContent = '';
//     updateUI(false);
// }

// function updateUI(isAuthenticated) {
//     console.log('Updating UI based on authentication state');
//     if (isAuthenticated) {
//         document.getElementById('login').style.display = 'none';
//         document.getElementById('logout').style.display = 'inline';
//     } else {
//         document.getElementById('login').style.display = 'inline';
//         document.getElementById('logout').style.display = 'none';
//     }
// }

async function initializeAuth0() {
    try {
        if (!window.auth0 || !window.auth0.createAuth0Client) {
            throw new Error('Auth0 SDK failed to load or is not available');
        }

        console.log('Initializing Auth0 client...');

        // This uses the global auth0 object provided by the SDK
        auth0 = await auth0.createAuth0Client({
            domain: 'dev-gkgncylqchbqob52.us.auth0.com',
            clientId: 'toUxIMe4zjdTVnYoeqM9RS7MyOpbetBS',
            authorizationParams: {
                redirect_uri: window.location.origin
            }
        });

        console.log('Auth0 client initialized successfully');
        
        await handleAuthentication();
    } catch (error) {
        console.error('Error during Auth0 initialization:', error.message, error.stack);
    }
}

async function handleAuthentication() {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        console.log('User is authenticated');
        const user = await auth0.getUser();
        showProfile(user);
    } else {
        console.log('User is not authenticated, checking for redirect...');
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            await auth0.handleRedirectCallback();
            const user = await auth0.getUser();
            showProfile(user);
            window.history.replaceState({}, document.title, "/");
        } else {
            updateUI(false);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            try {
                console.log('Attempting login with redirect');
                await auth0.loginWithRedirect();
            } catch (error) {
                console.error('Error during login:', error.message, error.stack);
            }
        });
    } else {
        console.error('Login button not found');
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            try {
                console.log('Attempting logout');
                auth0.logout({
                    returnTo: window.location.origin
                });
                hideProfile();
            } catch (error) {
                console.error('Error during logout:', error.message, error.stack);
            }
        });
    } else {
        console.error('Logout button not found');
    }

    // Initialize Auth0
    initializeAuth0();
});

function showProfile(user) {
    document.getElementById('profile').style.display = 'block';
    document.getElementById('profile-data').textContent = JSON.stringify(user, null, 2);
    updateUI(true);
}

function hideProfile() {
    document.getElementById('profile').style.display = 'none';
    document.getElementById('profile-data').textContent = '';
    updateUI(false);
}

function updateUI(isAuthenticated) {
    console.log('Updating UI based on authentication state');
    if (isAuthenticated) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inline';
    } else {
        document.getElementById('login').style.display = 'inline';
        document.getElementById('logout').style.display = 'none';
    }
}

