const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res, next) {
    const blogs = await Blog.find({});
    blogs.reverse()

    const email = req.session.user.email;

    res.render('blogs', {blogs, email});
});

router.get('/new', requireAuth, function (req, res, next) {
    const email = req.session.user.email;
    res.render('new_blog', {error: null, email});
});

router.post('/new', requireAuth, async function (req, res, next) {
    const {title, description, content} = req.body;

    if (!title || !content) {
        res.render("new_blog", {error: "Missing title or content"});
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const currentMonthString = months[currentMonth];
    const formatedDate = `${currentDay} ${currentMonthString} ${currentYear}`;
    const newBlogData = {
        id: String(Date.now()),
        title,
        description,
        content,
        author: req.session.user.email,
        date: new Date().toLocaleString(),
        formatedDate
    }

    try {
        const newBlog = new Blog(newBlogData);
        await newBlog.save();
        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
    }
});

router.get('/:blogId', requireAuth, async function (req, res, next) {
    const email = req.session.user.email;
    const {blogId} = req.params

    try {
        const blogs = await Blog.find();
        blogs.reverse()
        const blog = await Blog.findOne({id: blogId});
        res.render('blog', {email, blogs, blog});
    } catch (err) {
        console.log(err);
    }
});

router.post('/:blogId/comments', requireAuth, async (req, res) => {
    const { blogId } = req.params;
    const { text } = req.body;
    const email = req.session.user.email;

    if (!text) return res.redirect(`/blogs/${blogId}`);

    const comment = {
        id: String(Date.now()),
        author: email,
        text,
        date: new Date().toLocaleString(),
        likes: 0,
        replies: []
    };

    try {
        const blog = await Blog.findOne({ id: blogId });
        blog.comments = blog.comments || [];
        blog.comments.push(comment);
        await blog.save();
        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/blogs/${blogId}`);
    }
});

module.exports = router;

