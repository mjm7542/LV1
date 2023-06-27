const express = require('express');
const app = express();
const port = 3001;
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const connect = require("./schemas/index.js");
connect();

app.use(express.json());

app.use("/posts", [postsRouter]);
// app.use("/posts/:_postId/comments", [commentsRouter]); 폐기

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});