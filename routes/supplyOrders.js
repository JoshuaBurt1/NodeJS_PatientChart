const express = require("express");
const router = express.Router();
const SupplyOrder = require("../models/supplyOrder");
const IsLoggedIn = require("../extensions/authentication");

// GET /SupplyOrders/
router.get("/", IsLoggedIn,(req, res, next) => {
  SupplyOrder.find()
    .sort({ code: 1 }) //sorting function (alphabetically)
    .then((SupplyOrders) => {
      res.render("supplyOrders/index", {
        title: "Available Medical Supply List",
        dataset: SupplyOrders,
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /SupplyOrders/add
router.get("/add", IsLoggedIn, (req, res, next) => {
  res.render("supplyOrders/add", { title: "Add a New Supply", user: req.user });
});

// POST /SupplyOrders/add
router.post("/add", (req, res, next) => {
  SupplyOrder.create({
    code: req.body.code,
    description: req.body.description,
    amount: req.body.amount,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      res.redirect("/supplyOrders");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

//Delete a SupplyOrder
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let SupplyOrderId = req.params._id;
  SupplyOrder.deleteOne({ _id: SupplyOrderId })
    .then(() => {
      res.redirect("/supplyOrders");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
