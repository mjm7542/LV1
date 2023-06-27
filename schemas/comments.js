const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    "user": {
        type: String,
        required: true,
    },
    "password": {
        type: String,
        required: true,
    },
    "content": {
        type: String,
        required: true,
    },
    "createdAt": {
        type: Date,
        required: true,
        default: new Date()
    },
    "_postId": {
        required: true,
        type: String
    }
});

module.exports = mongoose.model("Comments", commentsSchema);