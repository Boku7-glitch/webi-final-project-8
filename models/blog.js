const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id: String,
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    replies: [{
        content: String,
        author: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [String]
});

const blogSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    content: String,
    author: String,
    date: String,
    formatedDate: String,
    comments: [commentSchema]
});

// const Blog = mongoose.model('Blog', blogSchema, "blogs");
// module.exports = Blog;
module.exports = mongoose.model('Blog', blogSchema);