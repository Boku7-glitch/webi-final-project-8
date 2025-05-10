const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const email = req.session.user ? req.session.user.email : null;
    res.render('about', { email: email });
});

module.exports = router;