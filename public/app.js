document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');
    const apiUrl = '/api/curriculum';

    // Initialize Auth0 client
    const auth0 = new Auth0Client({
        domain: 'YOUR_AUTH0_DOMAIN',
        client_id: 'YOUR_AUTH0_CLIENT_ID',
        redirect_uri: window.location.origin
    });

    // Check if the user is authenticated
    async function isAuthenticated() {
        return await auth0.isAuthenticated();
    }

    // Handle login
    async function login() {
        await auth0.loginWithRedirect();
    }

    // Handle logout
    async function logout() {
        auth0.logout({
            returnTo: window.location.origin
        });
    }

    // Register button action
    document.getElementById('registerBtn').addEventListener('click', async () => {
        await auth0.loginWithRedirect({ screen_hint: 'signup' });
    });

    // If user is authenticated, load the curriculum
    isAuthenticated().then(async (auth) => {
        if (auth) {
            const user = await auth0.getUser();
            console.log('User:', user);
            loadCurriculum();
        } else {
            login();  // Redirect to Auth0 login page if not authenticated
        }
    });

    // Fetch and display curriculum items
    function loadCurriculum() {
        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            appDiv.innerHTML = '<h2>Available Lessons</h2>';
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('curriculum-item');

                itemDiv.innerHTML = `
                    <p><strong>Date:</strong> ${item.date}</p>
                    <p><strong>Module:</strong> ${item.moduleName}</p>
                    <p><strong>Lesson:</strong> ${item.lessonName}</p>
                    <button onclick="requestLesson('${item._id}')">Request Lesson</button>
                    ${item.adminConfirmed ? `<p><strong>Confirmed:</strong> ${item.selectedUser ? item.selectedUser.firstName : 'None'}</p>` : ''}
                `;
                appDiv.appendChild(itemDiv);
            });
        })
        .catch(err => console.error('Error fetching curriculum:', err));
    }

    // Request a lesson
    window.requestLesson = function (lessonId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to request a lesson');
            return;
        }

        fetch(`${apiUrl}/${lessonId}/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Lesson requested successfully');
                loadCurriculum(); // Reload curriculum to show the updated request
            } else {
                alert('Error requesting lesson');
            }
        })
        .catch(err => console.error('Error requesting lesson:', err));
    };

    // Initial load
    const token = localStorage.getItem('token');
    if (token) {
        loadCurriculum();
    } else {
        appDiv.innerHTML = `
            <h2>Please log in to view and request lessons.</h2>
            <button id="loginBtn">Log In</button>
        `;
        document.getElementById('loginBtn').addEventListener('click', () => {
            window.location.href = '/api/auth/login';
        });
    }
});
