const mongoose = require('mongoose');
require('dotenv').config()

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://saba:broski@blogcluster.xxvnu3e.mongodb.net/?retryWrites=true&w=majority&appName=blogCluster', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('✅ MongoDB connected ✅'))
        .catch((err) => console.error('❌ MongoDB connection error ❌:', err));
};

// username: saba; password: broski

module.exports = {connectDatabase}