const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
};

router.get('/', requireAuth, async function (req, res, next) {
    try {
        const blogs = await Blog.find({});
        blogs.reverse();
        res.render('blogs', { blogs });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.get('/new', requireAuth, function (req, res, next) {
    res.render('new_blog', { error: null });
});

router.post('/new', requireAuth, async function (req, res, next) {
    const { title, description, content } = req.body;

    if (!title || !content) {
        return res.render("new_blog", { error: "Missing title or content" });
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
    };

    try {
        const newBlog = new Blog(newBlogData);
        await newBlog.save();
        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving blog");
    }
});

router.get('/:blogId', requireAuth, async function (req, res, next) {
    const { blogId } = req.params;

    try {
        const blogs = await Blog.find();
        blogs.reverse();
        const blog = await Blog.findOne({ id: blogId });

        if (!blog) return res.status(404).send("Blog not found");

        res.render('blog', {
            blogs,
            blog,
            user: req.session.user,
            email: req.session.user.email,
            photo: req.session.user.photo });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.post('/:blogId/newComment', requireAuth, async function (req, res, next) {
    const { blogId } = req.params;
    const { newComment } = req.body;

    try {
        const blog = await Blog.findOne({ id: blogId });
        if (!blog) throw new Error('Blog not found');

        const comment = {
            id: String(Date.now()),
            content: newComment,
            author: req.session.user.email,
            replies: []
        };

        await Blog.updateOne({ id: blogId }, { $push: { comments: comment } });

        const freshUser = await User.findById(req.session.user._id);
        req.session.user = freshUser;

        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to add comment");
    }
});

router.post('/:blogId/comment/:commentId/like', requireAuth, async function (req, res, next) {
    const { blogId, commentId } = req.params;
    const email = req.session.user.email;

    try {
        const blog = await Blog.findOne({ id: blogId, 'comments.id': commentId });
        const comment = blog.comments.find(c => c.id === commentId);
        const hasLiked = comment.likes && comment.likes.includes(email);

        const updateOperation = hasLiked
            ? { $pull: { 'comments.$.likes': email } }
            : { $addToSet: { 'comments.$.likes': email } };

        await Blog.updateOne({ id: blogId, 'comments.id': commentId }, updateOperation);
        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to update like");
    }
});

router.post('/:blogId/comment/:commentId/reply', requireAuth, async function (req, res, next) {
    const { blogId, commentId } = req.params;
    const { replyContent } = req.body;

    try {
        const reply = {
            content: replyContent,
            author: req.session.user.email
        };

        await Blog.updateOne(
            { id: blogId, 'comments.id': commentId },
            { $push: { 'comments.$.replies': reply } }
        );

        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to add reply");
    }
});

module.exports = router;


