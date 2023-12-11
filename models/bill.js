//Model represents billing in my database
const mongoose = require("mongoose");
const billSchemaObj = {
  code: { type: String, required: true },
  description: { type: String, required: true },
  insurance: { type: String, required: true },
};
var billingSchema = new mongoose.Schema(billSchemaObj);
module.exports = mongoose.model("Bill", billingSchema);

//note: naming convention > models are singular, routers are plural
