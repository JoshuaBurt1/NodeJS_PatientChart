const express = require("express");
const router = express.Router();
const Bill = require("../models/bill");
const IsLoggedIn = require("../extensions/authentication");

// GET /billing/
router.get("/", IsLoggedIn,  (req, res, next) => {
  Bill.find()
    .sort({ code: 1 }) //sorting function (alphabetically)
    .then((billing) => {
      res.render("billing/index", {
        title: "Billing Code List",
        dataset: billing,
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /billing/add
router.get("/add", IsLoggedIn, (req, res, next) => {
  res.render("billing/add", { title: "Add a New Billing Option", user: req.user });
});

// POST /billing/add
router.post("/add", IsLoggedIn, (req, res, next) => {
  Bill.create({
    code: req.body.code,
    description: req.body.description,
    insurance: req.body.insurance,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      // We can show a successful message by redirecting them to index
      res.redirect("/billing");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

//Delete a bill
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let billId = req.params._id;
  Bill.deleteOne({ _id: billId })
    .then(() => {
      res.redirect("/billing");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
