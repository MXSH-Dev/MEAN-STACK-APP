const express = require("express");
const router = express.Router();
const Post = require("../Models/post");
const checkAuth = require("../middlewares/check-auth");

const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if (!isValid) {
      error = new Error("Invalid MIME Type (file type)!");
    }
    callback(error, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const fileExtension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + fileExtension);
  },
});

router.get("", (req, res, next) => {
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

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
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
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
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

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log("FILE TYPE:", req.file);

    let newPost;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      newPost = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
      });
    } else {
      newPost = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath,
      });
    }

    console.log("updated post:", newPost);

    Post.updateOne({ _id: req.params.id }, newPost)
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "Post updated" });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

module.exports = router;
