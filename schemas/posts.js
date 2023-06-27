const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    "user": {
        type: String,
        required: true,
    },
    "password": {
        type: String,
        required: true
    },
    "title": {
        required: true,
        type: String,
    },
    "content": {
        required: true,
        type: String,
    },
    "createdAt": {
        type: String
    }
});

module.exports = mongoose.model("Posts", postsSchema);

// required: [true,  '데이터 형식이 올바르지 않습니다.' ]