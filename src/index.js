const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const bwFilter = require('bad-words');
const { sendMessage, sendLocation } = require('./utils/message');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New Websocket connection');
    socket.on('join', ({ username, room }, callback) => {

        const result=addUser({
            id:socket.id,
            username:username,
            room:room
        });
        if (result.error) {
            return callback(result.error);
        }



        socket.join(result.user.room);
        const usersInRoom=getUsersInRoom(result.user.room);
        io.to(result.user.room).emit('roomData',{room:result.user.room,users:usersInRoom});
        socket.emit('message', sendMessage('Admin','Welcome!'));
        socket.broadcast.to(result.user.room).emit('message', sendMessage('Admin',`${result.user.username} has joined`));
        callback();

    })



    socket.on('sendMessage', (chat, callback) => {

        const filter = new bwFilter();
        if (filter.isProfane(chat)) {
            return callback('Profane message');
        }

        const user = getUser(socket.id);
        io.to(user.room).emit('message', sendMessage(user.username, chat));
        callback();
    })




    socket.on('sendLocation', (locus, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', sendLocation(user.username, locus));
        callback();
    })




    //For disconnection
    socket.on('disconnect', () => {

        const aux = removeUser(socket.id);
         
       
        if (aux) {
            const usersInRoom=getUsersInRoom(aux.room);
             io.to(aux.room).emit('roomData',{room:aux.room,users:usersInRoom});
            io.to(aux.room).emit('message', sendMessage('Admin',`${aux.username} has left`));
        }
    })
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})