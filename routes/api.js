const express = require("express");
const apiController = require("../controller/apiController");

const router = express.Router();

router.get("/categories", apiController.getCategory);
router.get("/blogs", apiController.getBlogs);
router.get("/latestBlogs", apiController.getBlogsBeforeLatest);
router.get("/blogs/:title", apiController.getOneBlog);
router.post("/contact", apiController.createContact);

module.exports = router;
