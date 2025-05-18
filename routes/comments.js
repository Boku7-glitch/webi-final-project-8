const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

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
    const { text, author } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        comment.replies.push({ text, author, date: new Date().toISOString() });
        await comment.save();
        res.json({ replies: comment.replies });
    } catch (err) {
        res.status(500).json({ error: 'Reply failed' });
    }
});

module.exports = router;