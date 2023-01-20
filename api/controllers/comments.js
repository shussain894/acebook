const Comment = require("../models/comment");
const TokenGenerator = require("../models/token_generator");

const CommentsController = {
  Index: (req, res) => {
    Comment.find({ post_id: req.get("post_id") }, async (err, comments) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ comments: comments, token: token });
    });
  },
  Create: (req, res) => {
    console.log(req.user_id);
    const { text, post_id } = req.body;
    const user_id = req.user_id;

    const comment = new Comment({ text, user_id, post_id });
    comment.save(async (err) => {
      if (err) {
        throw err;
      }

      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token });
    });
  },
};

module.exports = CommentsController;
