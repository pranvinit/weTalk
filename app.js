const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const localhost = '127.0.0.1';
const PORT = process.env.PORT || 3000;
const botname = 'weTalk BOT';

/* utils functions */
const formatMessage = require('./utils/messages');
const {
    userJoined,
    getCurrentUser,
    userLeft,
    getRoomUsers
} = require('./utils/users');

/*end*/

app.use('/', express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
    socket.on('join-room', ({ username, room }) => {
        const user = userJoined(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage(botname, 'Welcome to the chat'));
        // socket.broadcast.to(user.room).emit('message', formatMessage(username, 'has joined the chat'));
        socket.to(user.room).emit('message', formatMessage(botname, `${username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on('msg-sent', message => {
        const user = getCurrentUser(socket.id);
        // socket.broadcast.to(user.room).emit('recieve', formatMessage(user.username, message));
        socket.to(user.room).emit('recieve', formatMessage(user.username, message));
    })

    socket.on('disconnect', () => {
        const user = userLeft(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }


    })

})
server.listen(PORT, () => {
    console.log(`Server running at http://${localhost}:${PORT}`)
})