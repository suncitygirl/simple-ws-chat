'use strict';

const passport = require('passport');
const config = require('../config/index');
const h = require('../utils/index')
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;


module.exports = () => {
    const authProcessor = (accessToken, refreshToken, profile, done) => {
        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => {
            h.findById(id)
                .then(user => done(null, user))
                .catch(error => console.log('Error when deserializing user'))
        }) 

        h.findOne(profile.id)
            .then(res => {
                if (res) {
                    done(null, res);
                } else {
                    h.createNewUser(profile)
                        .then(newChatUser => done(null, newChatUser))
                        .catch(error => console.log('Error when creating a new user', error))
                }
            })
    }

    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new TwitterStrategy(config.twitter, authProcessor));
}
