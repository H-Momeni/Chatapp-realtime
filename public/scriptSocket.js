
function showAlert(message) {
    alert(message);
};
const socket = io();

// Handle incoming chat messages
socket.on('chat message', (data) => {
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = `${data.user}: ${data.message}`;
    messages.appendChild(li);
});

// Handle receiving previous messages
socket.on('previous messages', (previousMessages) => {
    const messages = document.getElementById('messages');
    previousMessages.forEach((msg) => {
        const li = document.createElement('li');
        li.textContent = `${msg.info.name}: ${msg.text}`;
        messages.appendChild(li);
    });
});

socket.on('messagesCleared', () => {
    const messages = document.getElementById('messages');
    messages.innerHTML = ''; // Clear the chat interface for this client
});

// Handle form submission
document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    const input1 = document.getElementById('name');
    const message1 = input1.value.trim();

    //const



    if (message !== '' && message1 !== '') {
        socket.emit('chat message', { user: message1, message });
        input.value = '';
        document.getElementById('firstnameInput').style.display = 'none';
    }
    else if (message1 === '') {
        showAlert('please enter your username!');
    }
    else if (message === '') {
        showAlert('please enter your message!');
    }
});
document.getElementById('submitButton').addEventListener('click', (e) => {
    if (e.target.type === 'button' && e.target.textContent === 'clear History Chat') {
        socket.emit('clearDocuments');
    }
});


document.getElementById('logbtn').addEventListener('click', (e) => {
    const input1 = document.getElementById('name');
    const message1 = input1.value.trim();
    if (message1 !== '') {
        socket.emit('user save', { user: message1 });
    }
});
