const express = require("express");
const apiController = require("../controller/apiController");

const router = express.Router();

router.get("/categories", apiController.getCategory);
router.get("/blogs", apiController.getBlogs);
router.get("/blogs/:id", apiController.getOneBlog);
router.post("/contact", apiController.createContact);

module.exports = router;
