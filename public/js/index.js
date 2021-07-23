const socket = io.connect();
const form = document.getElementById('send-container');
const msgInput = document.getElementById('msg-input')
const msgContainer = document.getElementById('message-container');
const roomName = document.getElementById('roomName');
const userList = document.getElementById('userList');
var ting = new Audio('./media/tune.mp3');

const urlParams = new URLSearchParams(location.search);
const [username, room] = urlParams.values();


document.addEventListener('DOMContentLoaded', () => {
    msgInput.focus();
})

const append = (name, msg, date, position) => {
    const message = document.createElement('div');
    message.classList.add('messageStyle');
    message.classList.add(position);
    message.innerText = `${name} : ${msg}`
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('dateStyle');
    dateDiv.innerText = date;
    message.append(dateDiv);
    msgContainer.append(message)
    msgContainer.scrollTop = msgContainer.scrollHeight;
    if (position === 'left') {
        ting.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = new Date()
    const formattedDate = date.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
    const msg = msgInput.value;
    msg.trim();
    append('You', msg, formattedDate, 'right')
    socket.emit('msg-sent', msg)
    msgInput.value = '';
    msgInput.focus();
})

const outputUsers = (usersArray) => {
    userList.innerHTML = '';
    usersArray.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    })
}

socket.emit('join-room', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    roomName.innerText = room;
    outputUsers(users);
})

socket.on('message', ({ username, text, date }) => {
    append(username, text, date, 'center')
});

socket.on('recieve', ({ username, text, date }) => {
    append(username, text, date, 'left');
})

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});

