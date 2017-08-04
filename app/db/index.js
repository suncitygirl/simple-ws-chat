'use strict';

const config = require('../config/index');
const Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.connection.on('error', error => {
    console.log("DB error: ", error);
});

const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String, 
    profilePic: String
});

const userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
    Mongoose,
    userModel
}