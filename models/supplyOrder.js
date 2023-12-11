//Model represents supply orders in database
const mongoose = require("mongoose");
const supplyOrderSchemaObj = {
  code: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: String, required: true },
};
var supplyOrdersSchema = new mongoose.Schema(supplyOrderSchemaObj);
module.exports = mongoose.model("SupplyOrder", supplyOrdersSchema);
