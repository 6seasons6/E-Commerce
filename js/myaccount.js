document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in (using localStorage)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    const userNameDisplay = document.getElementById('userNameDisplay');
    const signUpOption = document.getElementById('signUpOption');
    const signInOption = document.getElementById('signInOption');
    const signOutOption = document.getElementById('signOutOption');

    if (isLoggedIn && username) {
        // User is logged in, display their name and show only the Sign Out option
        userNameDisplay.textContent = username;
        signUpOption.style.display = 'none';
        signInOption.style.display = 'none';
        signOutOption.style.display = 'block';
    } else {
        // User is not logged in, show Sign Up and Sign In options
        userNameDisplay.textContent = 'My Account';
        signUpOption.style.display = 'block';
        signInOption.style.display = 'block';
        signOutOption.style.display = 'none';
    }
});

function updateDropdown() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    const userNameDisplay = document.getElementById('userNameDisplay');
    const signUpOption = document.getElementById('signUpOption');
    const signInOption = document.getElementById('signInOption');
    const signOutOption = document.getElementById('signOutOption');

    if (isLoggedIn && username) {
        userNameDisplay.textContent = username;
        signUpOption.style.display = 'none';
        signInOption.style.display = 'none';
        signOutOption.style.display = 'block';
    } else {
        userNameDisplay.textContent = 'My Account';
        signUpOption.style.display = 'block';
        signInOption.style.display = 'block';
        signOutOption.style.display = 'none';
    }
}

// Call this function whenever the login state changes
updateDropdown();