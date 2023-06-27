const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Posts = require("../schemas/posts.js");

// 게시글 작성
router.post("/", async (req, res) => {
    const { user, password, title, content } = req.body;

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const createdAt = today.toISOString();
    try {
        const createdPosts = await Posts.create({ user, password, title, content, createdAt })
    } catch (err) { return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    res.json({ Message: "게시글을 생성하였습니다." });
})

// 게시글 조회
router.get("/", async (req, res) => {
    const posts = await Posts.find({})
    const results = posts.map((post) => {
        return {
            "postId": post._id,
            "user": post.user,
            "title": post.title,
            "createdAt": post.createdAt,
        }
    })
    res.json({ "data": results })
})

// 게시글 상세조회
router.get("/:_postId", async (req, res) => {
    const { _postId } = req.params;
    let posts
    try {
        posts = await Posts.find({ _id: _postId })
    } catch (error) { return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    const results = posts.map((post) => {
        return {
            "postId": post._id,
            "user": post.user,
            "title": post.title,
            "content": post.content,
            "createdAt": post.createdAt,
        }
    })
    res.json({ results })
})

// 게시글 수정 
router.put("/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    if (!password || !title || !content) { return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    let posts
    try {
        [posts] = await Posts.find({ _id: _postId })
    } catch (error) { return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' }) }
    if (password === posts.password) {
        await Posts.updateOne(
            { "_id": _postId },
            {
                $set: {
                    "title": title,
                    "content": content
                }
            }
        )
    }
    res.json({ "message": "게시글을 수정하였습니다." })
})

// 게시글 삭제 
router.delete("/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password } = req.body;
    console.log(req.body)
    if (!password) { return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    let posts
    try {
        [posts] = await Posts.find({ _id: _postId })
    } catch (error) { return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' }) }
    if (posts.password === password) {
        await Posts.deleteOne({ _id: _postId })
    }
    res.json({ "message": "게시글을 삭제하였습니다." })
})


const Comments = require("../schemas/comments.js")

// 댓글 생성
router.post("/:_postId/comments", async (req, res) => {
    const { _postId } = req.params;
    const { user, password, content } = req.body;
    try {
        const createdComments = await Comments.create({ user, password, content, _postId })
    } catch (err) { return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    res.json({ Message: "댓글을 생성하였습니다." });
})

// 댓글 조회
router.get("/:_postId/comments", async (req, res) => {
    const { _postId } = req.params;
    const comments = await Comments.find({ _postId: _postId })
    if (comments.length === 0) { return res.json({ message: '데이터 형식이 올바르지 않습니다.' }) }
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
router.put("/:_postId/comments/:_commentId", async (req, res) => {
    const { _postId, _commentId } = req.params;
    const { password, content } = req.body;
    if (!content) { return res.json({ message: '댓글 내용을 입력해주세요.' }) }
    const post = await Comments.find({ _postId: _postId })
    if (post.length === 0) { return res.json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    const [comments] = post.filter(p => p._id.toString() === _commentId)
    if (!comments) { return res.json({ message: '댓글 조회에 실패하였습니다.' }) }
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
router.delete("/:_postId/comments/:_commentId", async (req, res) => {
    const { _postId, _commentId } = req.params;
    const { password } = req.body;
    const post = await Comments.find({ _postId: _postId })
    if (post.length === 0) { return res.json({ message: '데이터 형식이 올바르지 않습니다.' }) }
    const [comments] = post.filter(p => p._id.toString() === _commentId)
    if (!comments) { return res.json({ message: '댓글 조회에 실패하였습니다.' }) }
    if (comments.password === password) {
        await Comments.deleteOne({ _id: _commentId })
    }
    res.json({ "message": "댓글을 삭제하였습니다." })
})


module.exports = router;


// 게시글 작성 - id값은 자동 생성되는 _id 사용,  시간은 자동으로 현재 시간이 같이 저장되게 함
// 게시글 조회 - 전체를 찍어보고 나온 형식을 본 다음 내가 필요한 값만 나오게 했다. => _id:_postId 로 처리 됨 왜 아깐 안됐는지 모르겠다
// 게시글 상세조회 -  const posts = await Posts.find({}) 전체 정보를 가져온다, _postId === post._id.toString() 타입이 객체타입으로 나와서 같은 문자열로 변경
// 게시글 수정 - 마찬가지로 전체 정보를 가져와서 id값을 비교하고 패스워드가 맞는 경우에만 내용을 바꾸도록 했다. 기존 장바군니처럼 바로 가져올 수가 없다.
// 미들 웨어로 댓글라우터를 분리했지만 확인해보니 postId를 읽어오지 못한다. => 라우터로 분리해도 이것을 가져오는 방법
// 댓글 - 저장시 _postId를 저장해서 가져올 때 이것을 통해 가져온다, 개별 댓글을 가져올 땐 p._id.toString()===_commentId 이렇게 한 번 더 필터링

