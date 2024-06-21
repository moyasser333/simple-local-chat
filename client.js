document.addEventListener('DOMContentLoaded', () => {
    const username = new URLSearchParams(window.location.search).get('username') || 'Guest';
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatBox = document.getElementById('chat-box');

    // Connect to the WebSocket server
    const socket = new WebSocket(`ws://${window.location.host}`);

    // Function to append a message to the chat box
    const appendMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    };

    // Event listener for receiving messages
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const message = `${data.username}: ${data.message}`;
        appendMessage(message);
    });

    // Function to handle sending messages
    const sendMessage = () => {
        const message = messageInput.value.trim();
        if (message !== '') {
            const data = {
                username: username,
                message: message
            };
            socket.send(JSON.stringify(data));
            messageInput.value = ''; // Clear the input
        }
    };

    // Event listener for the send button click
    sendButton.addEventListener('click', sendMessage);

    // Event listener for pressing "Enter" in the message input
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
