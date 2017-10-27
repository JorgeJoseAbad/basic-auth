/* jshint esversion:6 */
const express        = require("express");
const siteController = express.Router();

const User           = require("../models/user");

siteController.get("/", (req, res, next) => {
  res.render("home");
  });

//Middleware, if current user coincides, go to wait in sitecontroller.get
  siteController.use((req, res, next) => {
    if (req.session.currentUser) {
      next(); //if true, let free pass to next routes, if not, redirect login
    }
    else { res.redirect("/login"); }
  });

  siteController.get("/secret", (req, res, next) => {
    //add a parameter pass to secret.ejs,
    res.render("secret",{user:req.session.currentUser});
  });




module.exports = siteController;
