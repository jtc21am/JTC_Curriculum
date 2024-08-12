document.addEventListener('DOMContentLoaded', () => {
    const userInfoDiv = document.getElementById('user-info');
    const loginMessage = document.getElementById('login-message');

    function updateHomeDisplay() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        console.log('Is authenticated:', isAuthenticated);
        if (isAuthenticated) {
            userInfoDiv.style.display = 'block';
            loginMessage.style.display = 'none';
            displayUserInfo();
        } else {
            userInfoDiv.style.display = 'none';
            loginMessage.style.display = 'block';
        }
    }

    async function displayUserInfo() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            const response = await fetch(`/api/user-lessons/${user.sub}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const lessons = await response.json();

            const pendingLessons = lessons.filter(lesson => !lesson.confirmedLecturer);
            const confirmedLessons = lessons.filter(lesson => lesson.confirmedLecturer === user.name);
            const notConfirmedLessons = lessons.filter(lesson => lesson.confirmedLecturer && lesson.confirmedLecturer !== user.name);

            userInfoDiv.innerHTML = `
                <h2>Welcome, ${user.name}!</h2>
                <h3>Your Pending Requests:</h3>
                <ul>${pendingLessons.map(lesson => `<li>${lesson['Lesson Name']} - ${lesson.DATE}</li>`).join('')}</ul>
                <h3>Your Confirmed Lectures:</h3>
                <ul>${confirmedLessons.map(lesson => `<li>${lesson['Lesson Name']} - ${lesson.DATE}</li>`).join('')}</ul>
                <h3>Your Not-Confirmed Lectures:</h3>
                <ul>${notConfirmedLessons.map(lesson => `<li>${lesson['Lesson Name']} - ${lesson.DATE}</li>`).join('')}</ul>
            `;

            if (user.isAdmin) {
                userInfoDiv.innerHTML += `<p><strong>You have admin privileges.</strong></p>`;
            }
        } catch (error) {
            console.error('Error fetching user lessons:', error);
            userInfoDiv.innerHTML = 'Failed to load user information. Please try again later.';
        }
    }

    updateHomeDisplay();

    window.addEventListener('authStateChanged', () => {
        console.log('Auth state changed, updating home display');
        updateHomeDisplay();
    });
});