const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");


router.get('/', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', {error: null});
});

router.post('/', async function (req, res, next) {
    const {email, password, confirmPassword} = req.body;

    if (confirmPassword !== password) {
        return res.render('register', {error: 'Passwords do not match'});
    }

    try {
        const users = await User.find({email})
        if (users.length > 0) {
            return res.render('register', {error: 'Email already registered'})
        }
        if (password.length < 8) {
            return res.render('register', {error: 'Password should contain 8 characters'});
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({email, password: hashedPassword});
        await newUser.save();

        req.session.user = {email}

        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;