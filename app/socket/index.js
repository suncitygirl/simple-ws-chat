'use strict';

const h = require('../utils/index');

module.exports = (io, app) => {
    const allrooms = app.locals.chatrooms;

    io.of('roomslist').on('connection', socket => {
        socket.on('getChatrooms', () => {
            socket.emit('chatRoomsList', JSON.stringify(allrooms))
        });

        socket.on('createNewRoom', newRoomInput => { 
            if (!h.findRoomByName(allrooms, newRoomInput)) {
                allrooms.push({
                    room: newRoomInput,
                    roomID: h.getRandomHex(),
                    users: []
                });

                socket.emit('chatRoomsList', JSON.stringify(allrooms));
                socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
            }

        });
    })


}