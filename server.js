const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;

// Array to store messages
let messages = [];

const server = http.createServer((req, res) => {
    let filePath;
    if (req.url.startsWith('/chat.html')) {
        filePath = path.join(__dirname, 'chat.html');
    } else {
        filePath = path.join(__dirname, req.url === '/' ? 'login.html' : req.url);
    }

    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('New client connected');

    // Send existing messages to the newly connected client
    messages.forEach(message => ws.send(message));

    ws.on('message', message => {
        console.log('Received: %s', message);
        // Parse the incoming message as JSON
        const parsedMessage = JSON.parse(message);

        // Structure the message
        const structuredMessage = JSON.stringify({
            username: parsedMessage.username,
            message: parsedMessage.message
        });

        // Store the message
        messages.push(structuredMessage);

        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(structuredMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

