document.addEventListener('DOMContentLoaded', async () => {
    const userInfoDiv = document.getElementById('user-info');
    const loginMessage = document.getElementById('login-message');

    async function updateHomeDisplay() {
        // Wait until auth0Client is available
        let auth0Client;
        while (!window.auth0Client) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
            auth0Client = window.auth0Client;
        }

        const isAuthenticated = await auth0Client.isAuthenticated();
        console.log('Is authenticated:', isAuthenticated);

        if (isAuthenticated) {
            userInfoDiv.style.display = 'block';
            loginMessage.style.display = 'none';
            await displayUserInfo(auth0Client);
        } else {
            userInfoDiv.style.display = 'none';
            loginMessage.style.display = 'block';
        }
    }

    async function displayUserInfo(auth0Client) {
        try {
            const user = await auth0Client.getUser();
            if (!user) return;

            const response = await fetch(`/api/user-lessons/${user.sub}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const lessons = await response.json();

            const pendingLessons = lessons.filter(lesson => !lesson.confirmedLecturer);
            const confirmedLessons = lessons.filter(lesson => lesson.confirmedLecturer === user.name);
            const notConfirmedLessons = lessons.filter(lesson => lesson.confirmedLecturer && lesson.confirmedLecturer !== user.name);

            userInfoDiv.innerHTML = `
                <div class="p-6 bg-gray-100 rounded-lg shadow-lg">
                    <h3 class="text-2xl font-bold text-gray-800">Welcome, ${user.name}!</h3>

                    <div class="mt-6">
                        <h4 class="text-xl font-semibold text-gray-700">Your Pending Requests:</h4>
                        <ul class="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            ${pendingLessons.map(lesson => `<li>${lesson['Lesson Name']} - ${lesson.DATE}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-xl font-semibold text-gray-700">Your Confirmed Lectures:</h4>
                        <ul class="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            ${confirmedLessons.map(lesson => `<li>${lesson['Lesson Name']} - ${lesson.DATE}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-xl font-semibold text-gray-700">Your Not-Confirmed Lectures:</h4>
                        <ul class="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            ${notConfirmedLessons.map(lesson => `<li>${lesson['Lesson Name']} - ${lesson.DATE}</li>`).join('')}
                        </ul>
                    </div>

                    ${user.isAdmin ? `<p class="mt-4 text-red-600 font-bold">You have admin privileges.</p>` : ''}
                </div>
            `;

                // if (user.isAdmin) {
                //     userInfoDiv.innerHTML += `<p><strong>You have admin privileges.</strong></p>`;
                // }
        } catch (error) {
            console.error('Error fetching user lessons:', error);
            userInfoDiv.innerHTML = 'Failed to load user information. Please try again later.';
        }
    }

    // Initialize home display on load
    updateHomeDisplay();

    // Listen for authentication state changes
    window.addEventListener('authStateChanged', async () => {
        console.log('Auth state changed, updating home display');
        await updateHomeDisplay();
    });
});
