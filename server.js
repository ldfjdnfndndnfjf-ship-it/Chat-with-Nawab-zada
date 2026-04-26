const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', (socket) => {
    // Ye wala naya update hai jani
    socket.on('chat message', (data) => {
        io.emit('chat message', { 
            name: data.name, 
            msg: data.msg, 
            ip: socket.handshake.address 
        });
    });
});

http.listen(3000, () => console.log('Nawab ZADA Server Running!'));
