const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

const User = require('./model/user');
const req = require('express/lib/request');
const res = require('express/lib/response');

mongoose.connect('mongodb://localhost:27017/AuthDemo')
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(err => {
    console.log(err)
})

app.set('view engine', 'ejs');
app.set('views', 'views')
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'nosecret', resave: false, saveUninitialized: false}));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
};

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if(foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.redirect('/');
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    req.session.destroy();
    res.redirect('/');
})

app.listen(3000, ()=>{
    console.log('Server listening on port 3000')
})