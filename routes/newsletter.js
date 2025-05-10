const express = require('express');
const router = express.Router();
const fs = require('fs');

const BLOGS_FILE = 'blogs.json';

router.get('/', (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE));
    const email = req.session.user ? req.session.user.email : null;
    res.render('newsletter', { email: email, blogs: blogs });
});

module.exports = router;