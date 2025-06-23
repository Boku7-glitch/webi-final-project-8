const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Newsletter', newsletterSchema);