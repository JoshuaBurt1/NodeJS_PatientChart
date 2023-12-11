//Model represents icdCodes in my database
const mongoose = require("mongoose");
const icdCodeSchemaObj = {
  code: { type: String, required: true },
  description: { type: Array, required: true },
};
var icdCodesSchema = new mongoose.Schema(icdCodeSchemaObj);
module.exports = mongoose.model("IcdCode", icdCodesSchema);
