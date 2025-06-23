const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    res.render('forgot', { error: null, success: null });
});

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('forgot', { error: 'User with this email does not exist.', success: null });
        }

        const newPassword = Math.random().toString(36).slice(-8);
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashed });

        res.render('forgot', {
            error: null,
            success: `Your new temporary password is: ${newPassword} (Copy it so you don't forget)`
        });
    } catch (err) {
        console.log(err);
        res.render('forgot', { error: 'Something went wrong.', success: null });
    }
});

module.exports = router;
