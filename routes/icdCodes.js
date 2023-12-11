const express = require("express");
const router = express.Router();
const IcdCode = require("../models/icdCode");
const IsLoggedIn = require("../extensions/authentication");

// GET /icdCodes/
router.get("/", IsLoggedIn,(req, res, next) => {
  IcdCode.find()
    .sort({ code: 1 }) //sorting function (alphabetically)
    .then((icdCodes) => {
      res.render("icdCodes/index", {
        title: "ICD Code List",
        dataset: icdCodes,
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /icdCodes/add
router.get("/add", IsLoggedIn, (req, res, next) => {
  res.render("icdCodes/add", { title: "Add New ICD Code", user: req.user });
});

// POST /icdCodes/add
router.post("/add", (req, res, next) => {
  IcdCode.create({
    code: req.body.code,
    description: req.body.description,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      // We can show a successful message by redirecting them to index
      res.redirect("/icdCodes");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

// Delete an icdCode
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let icdCodeId = req.params._id;
  IcdCode.deleteOne({ _id: icdCodeId })
    .then(() => {
      res.redirect("/icdCodes");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
