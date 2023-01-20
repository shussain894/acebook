const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");

router.post("/", CommentsController.Create);
router.get("/", CommentsController.Index)

module.exports = router;