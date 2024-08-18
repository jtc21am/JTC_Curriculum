document.addEventListener('DOMContentLoaded', async () => {
    const profileContent = document.getElementById('profile-content');
    const loginMessage = document.getElementById('login-message');
    const profileForm = document.getElementById('profile-form');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');

    async function updateProfileDisplay() {
        // Wait until auth0Client is available
        let auth0Client;
        while (!window.auth0Client) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
            auth0Client = window.auth0Client;
        }

        const isAuthenticated = await auth0Client.isAuthenticated();
        console.log('Is authenticated:', isAuthenticated);

        if (isAuthenticated) {
            const user = await auth0Client.getUser();
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
                profilePhotoPreview.classList.remove('hidden');
            } else {
                profilePhotoPreview.classList.add('hidden');
            }

            profileContent.classList.remove('hidden');
            loginMessage.classList.add('hidden');
        } else {
            profileContent.classList.add('hidden');
            loginMessage.classList.remove('hidden');
        }
    }

    updateProfileDisplay();

    window.addEventListener('authStateChanged', async () => {
        await updateProfileDisplay();
    });

    document.getElementById('profilePhoto').addEventListener('input', (e) => {
        const photoUrl = e.target.value;
        if (photoUrl) {
            profilePhotoPreview.src = photoUrl;
            profilePhotoPreview.classList.remove('hidden');
        } else {
            profilePhotoPreview.classList.add('hidden');
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

        try {
            // Assume we have an endpoint to update user profile information
            const user = await auth0Client.getUser();
            const response = await fetch(`/api/update-profile/${user.sub}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the Auth0 user profile
            const updatedUser = { ...user, ...updatedProfile };
            // Optionally update local storage or application state
            localStorage.setItem('user', JSON.stringify(updatedUser));

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    });
});
