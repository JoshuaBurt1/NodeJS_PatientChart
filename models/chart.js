// Import mongoose
const mongoose = require("mongoose");

// Create schema definition object using mapping notation
const chartsSchemaDefinition = {
  brnNum: {type: Number, required: true},
  name: { type: String, required: true },
  updateDate: { type: Date, required: true}, 
  icdCode: { type: Array, required: true }, //primary mordbidity (admission reason, currently being treated for)
  icdCode: { type: Array, required: true }, //secondary morbidities (contributing factor)
  bill: { type: String, required: true }, //bill
  progressNote: { type: String, default: "Patient is continuing with initial care plan." }, //default
  supplyOrder: { type: Array, required: true },
  lhinUpdate: { type: String, required: true },
  measurement: { type: Array, required: true },
  image: { type: String}, 
  files: { type: String},
};

var chartsSchema = new mongoose.Schema(chartsSchemaDefinition);

//Limits number of chart entries addable to Chart to avoid overloading workers
chartsSchema.pre("save", async function (next) {
  try {
    const count = await this.constructor.countDocuments(); //counts number of documents in MongoDB
    if (count >=10) {
      throw new Error("Limit exceeded. Cannot add more entries.");
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Import new model > provide name and schema
module.exports = mongoose.model("Chart", chartsSchema);