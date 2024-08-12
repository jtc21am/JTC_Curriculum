document.addEventListener('DOMContentLoaded', () => {
    const curriculumContent = document.getElementById('curriculum-content');
    const loginMessage = document.getElementById('login-message');
    const curriculumTableDiv = document.getElementById('curriculumTable');

    function updateCurriculumDisplay() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        console.log('Is authenticated:', isAuthenticated);
        if (isAuthenticated) {
            curriculumContent.style.display = 'block';
            loginMessage.style.display = 'none';
            fetchCurriculumData();
        } else {
            curriculumContent.style.display = 'none';
            loginMessage.style.display = 'block';
        }
    }

    async function fetchCurriculumData() {
        try {
            console.log('Fetching curriculum data...');
            const response = await fetch('/api/curriculum');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Curriculum data:', data);
            if (data.length > 0) {
                renderCurriculumTable(data);
            } else {
                curriculumTableDiv.textContent = 'No curriculum data available.';
            }
        } catch (error) {
            console.error('Error fetching curriculum data:', error);
            curriculumTableDiv.textContent = 'Failed to load curriculum data. Error: ' + error.message;
        }
    }

    function renderCurriculumTable(items) {
        console.log('Rendering curriculum table with', items.length, 'items');
        const table = document.createElement('table');
        table.className = 'table table-striped';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Code</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Day</th>
                <th>Type</th>
                <th>Lesson</th>
                <th>Concepts Covered</th>
                <th>Purpose</th>
                <th>Request to Teach</th>
                <th>Status</th>
                <th>Confirmed Lecturer</th>
                ${isAdmin() ? '<th>Admin Actions</th>' : ''}
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.Code || ''}</td>
                <td>${item.DATE || ''}</td>
                <td>${item.HRS || ''}</td>
                <td>${item.DOW || ''}</td>
                <td>${item.Type || ''}</td>
                <td>${item['Lesson Name'] || ''}</td>
                <td>${item['Concepts Covered'] || ''}</td>
                <td>${item.Purpose || ''}</td>
                <td><input type="checkbox" class="request-checkbox" data-lesson-id="${item._id}" ${isLessonRequested(item) ? 'checked' : ''}></td>
                <td>${getStatus(item)}</td>
                <td>${item.confirmedLecturer || ''}</td>
                ${isAdmin() ? `<td><button class="btn btn-sm btn-primary confirm-lecturer" data-lesson-id="${item._id}">Confirm Lecturer</button></td>` : ''}
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        // Append the table to the curriculumTable div
        curriculumTableDiv.innerHTML = ''; // Clear previous content
        curriculumTableDiv.appendChild(table);
        
        // Add event listeners to checkboxes and confirm buttons
        document.querySelectorAll('.request-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });
        if (isAdmin()) {
            document.querySelectorAll('.confirm-lecturer').forEach(button => {
                button.addEventListener('click', handleConfirmLecturer);
            });
        }
    }

    function isAdmin() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && user.isAdmin;
    }

    function isLessonRequested(lesson) {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && lesson.requests && lesson.requests.some(req => req.userId === user.sub);
    }

    function getStatus(lesson) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return '';
        const userRequest = lesson.requests && lesson.requests.find(req => req.userId === user.sub);
        if (!userRequest) return '';
        if (lesson.confirmedLecturer === user.name) return 'Confirmed';
        if (lesson.confirmedLecturer) return 'Not Confirmed';
        return 'Pending';
    }

    async function handleCheckboxChange(event) {
        const lessonId = event.target.dataset.lessonId;
        const isChecked = event.target.checked;
        const user = JSON.parse(localStorage.getItem('user'));
        
        try {
            const response = await fetch('/api/request-lesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lessonId,
                    userId: user.sub,
                    userName: user.name,
                    timestamp: new Date().toISOString(),
                    request: isChecked
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log(`Lesson ${lessonId} request ${isChecked ? 'added' : 'removed'}`);
        } catch (error) {
            console.error('Error updating lesson request:', error);
            event.target.checked = !isChecked; // Revert checkbox state
            alert('Failed to update lesson request. Please try again.');
        }
    }

    async function handleConfirmLecturer(event) {
        const lessonId = event.target.dataset.lessonId;
        const lecturerId = prompt("Enter the ID of the user to confirm as lecturer:");
        if (!lecturerId) return;

        try {
            const response = await fetch('/api/admin/confirm-lecturer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lessonId, lecturerId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Lecturer confirmed successfully');
            fetchCurriculumData(); // Refresh the table
        } catch (error) {
            console.error('Error confirming lecturer:', error);
            alert('Failed to confirm lecturer. Please try again.');
        }
    }

    updateCurriculumDisplay();

    window.addEventListener('authStateChanged', () => {
        console.log('Auth state changed, updating curriculum display');
        updateCurriculumDisplay();
    });
});