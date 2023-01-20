const express = require("express");
const router = express.Router();

// Import middleware Multer for uploading pictures
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination running");
    cb(null, "./public/images");
  },

  filename: function (req, file, cb) {
    let fileName =
      uuidv4() + "-" + Date.now() + path.extname(file.originalname);
    console.log("File name running", fileName);
    cb(null, fileName);
  },
});

const filefilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  console.log("File filter running");
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, filefilter });

const PostsController = require("../controllers/posts");

router.get("/", PostsController.Index);
router.get("/user", PostsController.FindByUser);
router.get("/:id", PostsController.Find);
router.post("/", upload.single("photo"), PostsController.Create);
router.patch("/:id", PostsController.Update);
// DELETE a post
router.delete("/", PostsController.Delete);

module.exports = router;
