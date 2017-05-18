/* jshint esversion:6 */
const express        = require("express");
const siteController = express.Router();

const User           = require("../models/user");

siteController.get("/", (req, res, next) => {
  res.render("home");
  });

//if current user coincides, go to wait in sitecontroller.get
  siteController.use((req, res, next) => {
    if (req.session.currentUser) { next(); }
    else { res.redirect("/login"); }
  });

  siteController.get("/secret", (req, res, next) => {
    res.render("secret");
  });




module.exports = siteController;
