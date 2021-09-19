var express = require("express");
var multer = require("multer");
var path = require("path");

var uploadModel = require("../models/upload");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

var router = express.Router();
var imageData = uploadModel.find({});

var Storage = multer.diskStorage({
  destination: "./Project/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: Storage,
}).single("file");

router.post("/", upload, function (req, res, next) {
  var imageFile = req.file.filename;
  var success = req.file.filename + " uploaded successfully";

  var imageDetails = new uploadModel({
    imagename: imageFile,
    vname: req.body.vname,
    price: req.body.price,
    cno: req.body.cno,
    vregno: req.body.vregno,
    pyear: req.body.pyear,
    phoneno: req.body.phoneno,
    cnic: req.body.cnic,
    address: req.body.address,
    vmodel: req.body.vmodel,
  });
  imageDetails.save(function (err, doc) {
    if (err) throw err;

    imageData.exec(function (err, data) {
      if (err) throw err;

      res.redirect("/dashboard");
    });
  });
});

router.get("/", ensureAuthenticated, function (req, res, next) {
  res.render("regcar.ejs");
});

module.exports = router;
