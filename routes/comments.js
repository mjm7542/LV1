const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Comments = require("../schemas/comments.js");

// 댓글 생성
router.post("/", async (req, res) => {
    const { _postId } = req.params;
    console.log(_postId)
    const { user, password, content } = req.body;
    const createdComments = await Comments.create({ user, password, content })
    res.json({ Message: "댓글을 생성하였습니다." });
})

// 댓글 조회
router.get("/", async (req, res) => {
    const { _postId } = req.params;
    console.log(_postId)
    const comments = await Comments.find({})
    const results = comments.map((comment) => {
        return {
            "commentId": comment._id,
            "user": comment.user,
            "content": comment.content,
            "createdAt": comment.createdAt,
        }
    })
    res.json({ "data": results })
})

// 댓글 수정
router.put("/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password, content } = req.body;
    const [comments] = await Comments.find({ _id: _commentId })
    if (password === comments.password) {
        await Comments.updateOne(
            { "_id": _commentId },
            {
                $set: {
                    "content": content
                }
            }
        )
    }
    res.json({ "message": "댓글을 수정하였습니다." })
})

// 댓글 삭제
router.delete("/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password } = req.body;
    const [comments] = await Comments.find({ _id: _commentId })
    if (comments.password === password) {
        await Comments.deleteOne({ _id: _commentId })
    }
    res.json({ "message": "댓글을 삭제하였습니다." })
})

module.exports = router;