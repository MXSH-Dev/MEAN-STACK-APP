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

module.exports = multer({ storage: storage }).single("image");
