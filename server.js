const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
app.use(express.static(__dirname + '/index.html'));
const io = require('socket.io')(server);
const PORT = (process.env.PORT || 8000);

server.listen(PORT, () => {
console.log(`Server is Listening On Port ${PORT}`);
});
const users={};
io.on('connection',socket=>{
    // if any new user joins the chat,let know the other users who are already connected.
    socket.on('new-user-joined',name=>{
         users[socket.id]=name;
         socket.broadcast.emit('user-joined',name);
    });
    // if someone sends a message, broadcast message to others.
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
    // if someone leaves the chat,let know ohter users.
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});