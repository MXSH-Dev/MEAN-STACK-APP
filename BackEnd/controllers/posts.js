const Post = require("../Models/post");

const { json } = require("express");

exports.createPost = (req, res, next) => {
  // console.log(req.userData);
  // return res.status(200);
  const url = req.protocol + "://" + req.get("host");
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  // console.log(post);
  newPost
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "post created success",
        post: {
          id: newPost._id,
          title: newPost.title,
          content: newPost.content,
          imagePath: newPost.imagePath,
          creator: req.userData.userId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500),
        json({
          message: "create post failed",
          errorDetail: err,
        });
    });
};

exports.updatePost = (req, res, next) => {
  console.log("FILE TYPE:", req.file);

  let newPost;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    newPost = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
  } else {
    newPost = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: req.body.imagePath,
      creator: req.userData.userId,
    });
  }

  console.log("updated post:", newPost);

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, newPost)
    .then((result) => {
      console.log(result);

      if (result.n > 0) {
        res.status(200).json({ message: "Post updated" });
        return;
      }
      res.status(401).json({ message: "Not Authorized" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Post update failed!", errorDetail: err });
    });
};

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedDocs = null;
  if (pageSize >= 0 && currentPage >= 0) {
    postQuery.skip(pageSize * currentPage).limit(pageSize);
    // console.log("Page size", pageSize, "Page index", currentPage);
  }
  postQuery
    .find()
    .then((documents) => {
      // console.log(documents);
      fetchedDocs = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetch success",
        posts: fetchedDocs,
        totalPostCount: count,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Post fetch failed",
        errorDetail: err,
      });
    });
};

exports.getPost = (req, res, next) => {
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
      res.status(500).json({
        message: "Post fetch failed",
        errorDetail: err,
      });
    });
};

exports.deletePost = (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.n === 0) {
        res.status(401).json({ message: "Not Authorized" });
        return;
      }
      res.status(200).json({ message: "Post deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Post delete failed",
        errorDetail: err,
      });
    });
};
