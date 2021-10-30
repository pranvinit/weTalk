const socket = io.connect();
const displayName = document.getElementById('user-name');
const form = document.getElementById('send-container');
const msgInput = document.getElementById('msg-input')
const msgContainer = document.getElementById('message-container');
const roomName = document.getElementById('roomName');
const userList = document.getElementById('userList');
const resUserList = document.getElementById('res-userList');
const hamIcon = document.getElementById('ham-container')
const hamMenu = document.getElementById('ham-menu');
var ting = new Audio('./media/tune.mp3');

const urlParams = new URLSearchParams(location.search);
const [username, room] = urlParams.values();

hamIcon.addEventListener('click', () => {
    if (hamMenu.style.display == 'none') {
        hamMenu.style.display = 'flex';
        hamIcon.querySelector('.ham-span-1').classList.add('top')
        hamIcon.querySelector('.ham-span-2').style.backgroundColor = 'transparent';
        hamIcon.querySelector('.ham-span-3').classList.add('last')
    }
    else {
        hamMenu.style.display = 'none';
        hamIcon.querySelector('.ham-span-1').classList.remove('top')
        hamIcon.querySelector('.ham-span-2').style.backgroundColor = 'white';
        hamIcon.querySelector('.ham-span-3').classList.remove('last')
    }
});

document.addEventListener('DOMContentLoaded', () => {
    msgInput.focus();
    displayName.innerText = username;
})

const append = (name, msg, date, position) => {
    const message = document.createElement('div');
    message.classList.add('messageStyle');
    message.classList.add(position);
    message.innerText = `${name}: ${msg}`
    const dateElement = document.createElement('span');
    dateElement.classList.add('dateStyle');
    dateElement.innerText = date;
    message.append(dateElement);
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

    //Handling seperately for mobile devices
    resUserList.innerHTML = '';
    usersArray.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        resUserList.appendChild(li);
    })
}

socket.emit('join-room', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    roomName.innerText = `${room} room`;
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

document.getElementById('res-leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});

