'use strict'

const express = require('express')
const chat = require('./app/index');
const passport = require('passport');

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static('./client/public/') )
app.set('view engine', 'ejs')
app.set('views', './client/views')

app.use(chat.session);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', chat.router);

app.get('/dashboard', (req, res, next) => {
    res.send('2');
})

chat.ioServer(app).listen(app.get('port'), () => {
    console.log('chat is running on port 3000');
});
