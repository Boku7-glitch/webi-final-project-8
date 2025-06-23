const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const User = require('../models/user');

router.post('/:id/like', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        comment.likes += 1;
        await comment.save();
        res.json({ likes: comment.likes });
    } catch (err) {
        res.status(500).json({ error: 'Like failed' });
    }
});

router.post('/:id/reply', async (req, res) => {
    const { text } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const comment = await Comment.findById(req.params.id);
        comment.replies.push({
            text,
            author: {
                id: user._id,
                email: user.email,
                photo: user.photo
            },
            date: new Date().toISOString()
        });
        await comment.save();
        res.json({ replies: comment.replies });
    } catch (err) {
        res.status(500).json({ error: 'Reply failed' });
    }
});

// Post a new comment
router.post('/:blogId', async (req, res) => {
    const { text } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const newComment = new Comment({
            blogId: req.params.blogId,
            text,
            author: {
                id: user._id,
                email: user.email,
                photo: user.photo
            },
            date: new Date().toISOString(),
            likes: 0,
            replies: []
        });

        await newComment.save();
        res.json(newComment);
    } catch (err) {
        res.status(500).json({ error: 'Comment failed' });
    }
});

module.exports = router;
