const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    text: String,
    author: String,
    date: String,
});

const commentSchema = new mongoose.Schema({
    blogId: String,
    text: String,
    author: String,
    date: String,
    likes: {
        type: Number,
        default: 0
    },
    replies: [replySchema]
});

module.exports = mongoose.model('Comment', commentSchema);