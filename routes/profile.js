const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const requireAuth = (req, res, next) => {
    if (req.session.user && req.session.user._id) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.render('profile', {
                email: '',
                photo: null,
                user: null,
                error: 'User not found.',
                success: null
            });
        }

        res.render('profile', {
            email: user.email,
            photo: user.photo || null,
            user,
            error: null,
            success: null
        });
    } catch (err) {
        console.log(err);
        res.render('profile', {
            email: null,
            photo: null,
            user: null,
            error: 'Can\'t load profile information.',
            success: null
        });
    }
});

router.post('/upload-photo', requireAuth, upload.single('photo'), async (req, res) => {
    try {
        const photoPath = req.file.filename;
        await User.findByIdAndUpdate(req.session.user._id, { photo: photoPath });

        const user = await User.findById(req.session.user._id);

        req.session.user = user;

        res.render('profile', {
            email: user.email,
            photo: user.photo || null,
            user,
            error: null,
            success: 'Profile photo uploaded successfully.'
        });
    } catch (err) {
        console.log(err);
        const user = await User.findById(req.session.user._id);

        res.render('profile', {
            email: user?.email || '',
            photo: user?.photo || null,
            user,
            error: 'Can\'t upload profile picture.',
            success: null
        });
    }
});

router.post('/change-password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.render('profile', {
                email: '',
                photo: null,
                user: null,
                error: 'Can\'t find the user.',
                success: null
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.render('profile', {
                email: user.email,
                photo: user.photo || null,
                user,
                error: 'Old password is incorrect.',
                success: null
            });
        }

        if (newPassword !== confirmPassword) {
            return res.render('profile', {
                email: user.email,
                photo: user.photo || null,
                user,
                error: 'Passwords do not match.',
                success: null
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        req.session.user = user;

        res.render('profile', {
            email: user.email,
            photo: user.photo || null,
            user,
            error: null,
            success: 'Password successfully updated.'
        });
    } catch (err) {
        console.log(err);
        const user = await User.findById(req.session.user._id);

        res.render('profile', {
            email: user?.email || '',
            photo: user?.photo || null,
            user,
            error: 'An error occurred while updating the password.',
            success: null
        });
    }
});

module.exports = router;

