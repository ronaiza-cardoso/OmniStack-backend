const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectUsers = {}

io.on('connection', socket => {
    const { user } = socket.handshake.query
    connectUsers[user] = socket.id
});

mongoose.connect('mongodb+srv://tindev_pass:tindev_pass@cluster0-mvrmx.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
})

app.use((req, res, next) => {
    req.io = io
    req.connectUsers = connectUsers

    return next();
})

app.use(cors())
app.use(express.json())
app.use(routes);
server.listen(3333);