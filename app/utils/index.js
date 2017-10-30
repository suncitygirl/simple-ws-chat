'use strict';

const router = require('express').Router();
const db = require('../db/index');
const crypto = require('crypto');

const registerRoutes = (routes, method) => {
        for (let key in routes) {
            if (typeof(routes[key]) === 'object'
                    && routes[key]
                    && !(routes[key] instanceof Array)) {
                registerRoutes(routes[key], key);
            } else {
                switch (method) {
                    case 'get':
                        router.get(key, routes[key]);
                        break;
                    case 'post':
                        router.post(key, routes[key]);
                        break;
                    default: 
                        router.use(routes[key])
                        break;
                }
            }
        }
    }

const route = routes => {
    registerRoutes(routes);
    return router;
}


const findOne = profileID => {
    return db.userModel.findOne({
        'profileId': profileID,
    });
}

const findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    })
}

const createNewUser = (profile) => {
    return new Promise((resolve, reject) => {
        const newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || '' 
        });

        newChatUser.save(error => {
            if (error) {
                reject(error);
            } else {
                resolve(newChatUser);
            }
        });
    });
 
} 


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}

const findRoomByName = (allrooms, room) =>
    allrooms.findIndex(item => item.room === room) > -1;

const findRoomById = (allrooms, roomID) =>
    allrooms.find(item => item.roomID === roomID)

const getRandomHex = () =>
    crypto.randomBytes(24).toString('hex');

const addUserToRoom = (allrooms, data, socket) => {
    const room = findRoomById(allrooms, data.roomID);
    if (room) { 
        const userID = socket.request.session.passport.user;
        const checkUser = room.users.findIndex(item => item.userID === userID);
        if (checkUser > -1) {
            room.users.splice(checkUser, 1);
        }

        room.users.push({
            socketID: socket.id,
            userID,
            user: data.user,
            userPic: data.userPic,
        });

        socket.join(data.roomID);

        return room;
    }
}

const removeUserFromRoom = (allrooms, socket) => {
    for (let room of allrooms) {
        let findUser = room.users.findIndex(x => x.socketID === socket.id)
        if (findUser > -1) {
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            return room;
        }
    }
}

module.exports = {
    route,
    findOne,
    findById,
    createNewUser,
    isAuthenticated,
    findRoomByName,
    findRoomById,
    getRandomHex,
    addUserToRoom,
    removeUserFromRoom
}
