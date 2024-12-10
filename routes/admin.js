const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const authController = require("../controller/authController");
const categoryController = require("../controller/categoryController");

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
 

module.exports = router;
