const bcrypt = require("bcryptjs");
const { methods: commonService } = require("../services/index");
const { Admin } = require("../models");

// Show login page
const getRegister = (req, res) => {
  res.render("register", { title: "Register", error: "" });
};

const register = async (req, res) => {
  const { name, email, password } = req?.body;

  const hashPassword = await commonService.generateHashPassword(password, 8);
  let obj = { name, email, password: hashPassword };
  const userDetail = await Admin.findOne({ where: { email: email } });
  if (!userDetail) {
    try {
      const data = await Admin.create(obj);
      if (data) {
        res.redirect("/admin/login");
      } else {
        res.render("register", {
          title: "Register",
          error: "Server error.",
          oldVal: { name, email },
        });
      }
    } catch (error) {
      res.render("register", {
        title: "Register",
        error: "Email all ready exists.",
        oldVal: { name, email },
      });
    }
  } else {
    res.render("register", {
      title: "Register",
      error: "Email all ready exists.",
      oldVal: { name, email },
    });
  }
};

const getLogin = (req, res) => {
  res.render("login", { title: "Login", error: "" });
};

const login = async (req, res) => {
  const { email, password: pwd } = req?.body;
  const userDetail = await Admin.findOne({
    where: { email: email },
  });
  console.log(userDetail);
  if (userDetail) {
    let passwordValidate = await commonService.passwordCompare(
      pwd,
      userDetail.password
    );
    const token = await commonService.generateToken(userDetail);
    if (passwordValidate) {
      console.log("object");
      res.cookie("_gmtls", token);
      res.redirect("/admin/dashboard");
    } else {
      res.render("login", { title: "Login", error: "Credential not valid." });
    }
  } else {
    res.render("login", { title: "Login", error: "Credential not valid." });
  }
};
const logout = (req, res) => {
  res.clearCookie("_gmtls");
  res.redirect("/admin/login");
};

module.exports = { getLogin, getRegister, register, login, logout };
