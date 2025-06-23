const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Newsletter = require('../models/news');

router.get('/', async function (req, res, next) {
    const email = req.session.user ? req.session.user.email : null;
    const user = req.session.user || null;
    const blogs = await Blog.find({});
    blogs.reverse()

    res.render('newsletter', {error: null, email, blogs, user});
});

router.post('/', async function (req, res, next) {
    const { email } = req.body

    try {
        const subscriberData = {
            id: String(Date.now()),
            author: email,
        }

        const newSubscriber = new Newsletter(subscriberData);
        const result = await newSubscriber.save();
        console.log(result);
    } catch (err) {
        console.log(err);
    }

    res.redirect('/newsletter');
});

module.exports = router;