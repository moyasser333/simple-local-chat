window.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name-input');
    const loginButton = document.getElementById('login-button');

    // Function to handle login
    const handleLogin = () => {
        const name = nameInput.value.trim();

        if (name !== '') {
            // Store the user's name in sessionStorage
            sessionStorage.setItem('username', name);
            // Redirect to the chat page
            redirectToChat(name);
        } else {
            // Show an error message if the name field is empty
            alert('Please enter your name.');
        }
    };

    // Function to redirect to the chat page with username
    const redirectToChat = (name) => {
        window.location.href = `chat.html?username=${encodeURIComponent(name)}`;
    };

    // Event listener for the login button click
    loginButton.addEventListener('click', handleLogin);

    // Event listener for pressing "Enter" in the name input
    nameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
});

