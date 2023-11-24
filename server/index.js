const http = require('http');
const server = http.createServer();

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

const users = {};


io.on("connection", (socket) => {
    // Maneja la asignación de nombres de usuario
    socket.on("set_username", (username) => {
        users[socket.id] = username;
        console.log(`${username} connected with ID: ${socket.id}`);
    });

    socket.on("chat_message", (body) => {
        // Modifica el evento para incluir el nombre de usuario en lugar de la ID del socket
        const username = users[socket.id] || "Anonimo";
        socket.broadcast.emit("chat_message", {
            body,
            from: username,
        });
    });
});

server.listen(3000);