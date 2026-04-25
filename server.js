const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', (socket) => {
  const ip = socket.handshake.address; // IP capture
  socket.on('chat message', (data) => {
    // Admin ko IP aur message dono show honge
    io.emit('chat message', { name: data.name, msg: data.msg, ip: ip });
  });
});

http.listen(3000, () => console.log('Nawab ZADA Server Running!'));
