const express = require("express");
const router = express.Router();
var data = require("../models/upload");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  var records = await data.find();
  res.render("dashboard", {
    user: req.user,
    records: records,
  });
});

// Admin Dashboard
router.get("/dashboard2", ensureAuthenticated, async (req, res) => {
  var records = await data.find();
  res.render("dashboard2", {
    user: req.user,
    records: records,
  });
});

// Profile Page
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    user: req.user,
    email: req.email,
  });
});

module.exports = router;
