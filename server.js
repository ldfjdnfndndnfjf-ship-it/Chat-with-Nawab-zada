const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

let blockedIPs = [];

// Static folder define karna zaroori hai
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    if (blockedIPs.includes(ip)) {
        socket.disconnect();
        return;
    }

    socket.on('chat message', (data) => {
        if (data.msg.includes("http") || data.msg.length > 200) return;
        io.emit('chat message', { name: data.name, msg: data.msg, ip: ip });
    });

    socket.on('block-ip', (ipToBlock) => {
        blockedIPs.push(ipToBlock);
    });
});

// Vercel ke liye port process.env.PORT zaroori hai
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
