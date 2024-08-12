document.addEventListener('DOMContentLoaded', () => {
    const profileContent = document.getElementById('profile-content');
    const loginMessage = document.getElementById('login-message');
    const profileForm = document.getElementById('profile-form');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');

    function updateProfileDisplay() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            const user = JSON.parse(localStorage.getItem('user'));
            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('bio').value = user.bio || '';
            document.getElementById('linkedin').value = user.linkedin || '';
            document.getElementById('employer').value = user.employer || '';
            document.getElementById('jobTitle').value = user.jobTitle || '';
            document.getElementById('github').value = user.github || '';
            document.getElementById('profilePhoto').value = user.profilePhoto || '';
            
            if (user.profilePhoto) {
                profilePhotoPreview.src = user.profilePhoto;
                profilePhotoPreview.style.display = 'block';
            } else {
                profilePhotoPreview.style.display = 'none';
            }

            profileContent.style.display = 'block';
            loginMessage.style.display = 'none';
        } else {
            profileContent.style.display = 'none';
            loginMessage.style.display = 'block';
        }
    }

    updateProfileDisplay();

    window.addEventListener('authStateChanged', () => {
        updateProfileDisplay();
    });

    document.getElementById('profilePhoto').addEventListener('input', (e) => {
        const photoUrl = e.target.value;
        if (photoUrl) {
            profilePhotoPreview.src = photoUrl;
            profilePhotoPreview.style.display = 'block';
        } else {
            profilePhotoPreview.style.display = 'none';
        }
    });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedProfile = {
            name: document.getElementById('name').value,
            bio: document.getElementById('bio').value,
            linkedin: document.getElementById('linkedin').value,
            employer: document.getElementById('employer').value,
            jobTitle: document.getElementById('jobTitle').value,
            github: document.getElementById('github').value,
            profilePhoto: document.getElementById('profilePhoto').value
        };
        console.log('Updating profile:', updatedProfile);
        // Here you would send this data to your server to update the user's profile
        // For now, we'll just update the local storage
        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...user, ...updatedProfile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    });
});