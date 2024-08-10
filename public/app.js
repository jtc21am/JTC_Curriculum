document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');
    const apiUrl = '/api/curriculum';

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
                    <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
                    <p><strong>Module:</strong> ${item.moduleName}</p>
                    <p><strong>Lesson:</strong> ${item.lessonName}</p>
                    <button onclick="requestLesson('${item._id}')">Request Lesson</button>
                    ${item.adminConfirmed ? `<p><strong>Confirmed:</strong> ${item.speakers.length > 0 ? item.speakers.map(s => s.firstName).join(', ') : 'None'}</p>` : ''}
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

    // Check if the user is authenticated and load the curriculum
    const token = localStorage.getItem('token');
    if (token) {
        loadCurriculum();
    } else {
        appDiv.innerHTML = `
            <h2>Please log in to view and request lessons.</h2>
            <button id="loginBtn">Log In</button>
        `;
        document.getElementById('loginBtn').addEventListener('click', () => {
            window.location.href = '/api/auth/login'; // Assuming you have a route that handles Auth0 login redirection
        });
    }
});
