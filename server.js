const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Blacklist array (yahan block kiye gaye IP save honge)
let blockedIPs = [];

io.on('connection', (socket) => {
    // Real IP header (Vercel ke liye)
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    // Agar IP block list mein hai to connection reject
    if (blockedIPs.includes(ip)) {
        socket.disconnect();
        return;
    }

    socket.on('chat message', (data) => {
        // Auto-Remove Spam/Links
        if (data.msg.includes("http") || data.msg.length > 200) {
            console.log("Spam detected from: " + ip);
            return; // Msg process nahi hoga
        }

        io.emit('chat message', { name: data.name, msg: data.msg, ip: ip });
    });

    // Block logic (Admin se command aayi to)
    socket.on('block-ip', (ipToBlock) => {
        blockedIPs.push(ipToBlock);
    });
});

http.listen(3000);
