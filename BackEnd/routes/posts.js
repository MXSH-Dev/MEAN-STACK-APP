const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");

const multer = require("multer");

const PostController = require("../controllers/posts");

const FileUploadMiddleware = require("../middlewares/imageUpload");

router.get("", PostController.getAllPosts);

router.get("/:id", PostController.getPost);

router.post("", checkAuth, FileUploadMiddleware, PostController.createPost);

router.delete("/:id", checkAuth, PostController.deletePost);

router.put("/:id", checkAuth, FileUploadMiddleware, PostController.updatePost);

module.exports = router;
