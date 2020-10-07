const express = require("express");
const router = express.Router();
const Post = require("../Models/post");

router.get("", (req, res, next) => {
  Post.find()
    .then((documents) => {
      console.log(documents);
      res.status(200).json({
        message: "Post fetch success",
        posts: documents,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          message: "Post fetch success",
          post: doc,
        });
      } else {
        res.status(404).json({
          message: "Post does not exist",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // console.log(post);
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "post created success",
        postId: result._id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/:id", (req, res, next) => {
  console.log(req.params.id);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post)
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post updated" });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
