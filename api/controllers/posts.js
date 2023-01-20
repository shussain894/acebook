const Post = require("../models/post");
const TokenGenerator = require("../models/token_generator");

const PostsController = {
  Index: (req, res) => {
    Post.find(async (err, posts, user_id) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ user_id: user_id, posts: posts, token: token });
    });
  },
  Find: (req, res) => {
    Post.findOne({ _id: req.params.id })
      .then(() => {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(200).json({ user_id: user_id, posts: posts, token: token });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  },

  Create: (req, res) => {
    const message = req.body.message;
    const user_id = req.body.user_id;
    let photo = "";

    if (req.file !== undefined) {
      photo = req.file.filename;
    }

    const postObject = {
      message,
      user_id,
      photo,
    };

    const post = new Post(postObject);

    post.save(async (err) => {
      if (err) {
        throw err;
      }
      // console.log(req.user_id)
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token });
    });
  },

  Update: async (req, res) => {
    try {
      if (!req.body.liked) {
        switch (req.body.emoji) {
          case "like":
            await Post.updateOne(
              { _id: req.params.id },
              { $addToSet: { likes: req.body.user_id } }
            );
            break;
          case "heart":
            await Post.updateOne(
              { _id: req.params.id },
              { $addToSet: { hearts: req.body.user_id } }
            );
            break;
          case "fire":
            await Post.updateOne(
              { _id: req.params.id },
              { $addToSet: { fires: req.body.user_id } }
            );
            break;
          case "angry":
            await Post.updateOne(
              { _id: req.params.id },
              { $addToSet: { angrys: req.body.user_id } }
            );
        }
      } else {
        switch (req.body.emoji) {
          case "like":
            await Post.updateOne(
              { _id: req.params.id },
              { $pull: { likes: req.body.user_id } }
            );
            break;
          case "heart":
            await Post.updateOne(
              { _id: req.params.id },
              { $pull: { hearts: req.body.user_id } }
            );
            break;
          case "fire":
            await Post.updateOne(
              { _id: req.params.id },
              { $pull: { fires: req.body.user_id } }
            );
            break;
          case "angry":
            await Post.updateOne(
              { _id: req.params.id },
              { $pull: { angrys: req.body.user_id } }
            );
        }
      }
      const token = await TokenGenerator.jsonwebtoken(req.body.user_id);
      res.status(200).json({ message: "OK", token: token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  Delete: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({ _id: req.get("Post_ID") });
      const token = await TokenGenerator.jsonwebtoken(req.user_id);

      res.status(200).json({ message: "DELETED", token: token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  FindByUser: (req, res) => {
    Post.find({ user_id: req.get("User_ID") }, async (err, posts) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ posts: posts, token: token });
    });
  },
};

module.exports = PostsController;
