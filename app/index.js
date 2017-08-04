'use strict';

const router = require('./routes/index')();
const session = require('./session/index');
require('./auth/index')();

const ioServer = app => {
    //todo
    app.locals.chatrooms = [];
    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    io.use((socket, next) => {
        require('./session/index')(socket.request, {}, next)
    })
    require('./socket/index')(io, app);
    return server;
}

module.exports = {
    router,
    session,
    ioServer
}