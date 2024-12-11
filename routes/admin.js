const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const authController = require("../controller/authController");
const categoryController = require("../controller/categoryController");
const blogController = require("../controller/blogController");
const contactController = require("../controller/contactController");
const { upload } = require("../config/multerConfig");

const router = express.Router();

// Routes
router
  .route("/register")
  .get(authController.getRegister)
  .post(authController.register);

router.route("/login").get(authController.getLogin).post(authController.login);

router.get("/logout", authController.logout);

router.get("/dashboard", authCheck, function (req, res, next) {
  res.render("dashboard", {
    title: "DashBoard",
    activePage: "dashboard",
    auth: req?.auth,
  });
});

router.get("/category", categoryController.getIndex);
router.get("/category/create", categoryController.create);
router.post("/category/store", categoryController.store);
router.get("/category/edit/:id", categoryController.edit);
router.post("/category/:id/update", categoryController.update);
router.post("/category/:id/delete", categoryController.destroy);

router.get("/blogs", blogController.getIndex);
router.get("/blogs/create", blogController.create);
router.post("/blogs/store", upload.array("image"), blogController.store);
router.get("/blogs/:id/edit", blogController.edit);
router.post(
  "/blogs/updates/:id",
  upload.array("image"),
  blogController.update
);
router.post("/blogs/:id/delete", blogController.destroy);

router.get("/contact", contactController.getIndex);

module.exports = router;
