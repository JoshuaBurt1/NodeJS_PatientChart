// Import express and create a router object
const express = require("express");
const path = require('path');
const router = express.Router();

//Folder creation and deletion
const fs = require('fs');

//Mongoose models
const Chart = require("../models/chart");
const IcdCode = require("../models/icdCode");
const Bill = require("../models/bill");
const SupplyOrder = require("../models/supplyOrder");
const IsLoggedIn = require("../extensions/authentication");

//Configure GET/POST handlers
router.get("/", async (req, res, next) => {
  try {
    // Counts charts, does not allow for more than 10 charts to be created
    const count = await Chart.countDocuments();
    // Sorting function (alphabetically) using await
    const charts = await Chart.find().sort({ brnNum: 1 });
    res.render("charts/index", {
      count,
      title: "Chart Tracker Dataset",
      dataset: charts,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//renders chart count in index.hbs
router.get("/", async (req, res, next) => {
  try {
    const count = await Chart.countDocuments();
    res.render("index", { count, title: "Online Chart", user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET - Render add chart view
router.get("/add", IsLoggedIn, async (req, res, next) => {
  try {
    const [icdCodeList, billList, supplyList] = await Promise.all([
      IcdCode.find().exec(),
      Bill.find().exec(),
      SupplyOrder.find().exec(),
    ]);
    res.render("charts/add", {
      title: "Add a new Chart",
      icdCodes: icdCodeList,
      billing: billList,
      supplyOrders: supplyList,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
});

//POST - Create new chart after pressing save
router.post("/add", IsLoggedIn,(req, res, next) => {
  //res.redirect("/charts");
  Chart.create({
    brnNum: req.body.brnNum,
    name: req.body.name,
    updateDate: req.body.updateDate,
    icdCode: req.body.icdCode,
    icdCode: req.body.icdCode,
    progressNote: req.body.progressNote,
    lhinUpdate: req.body.lhinUpdate,
    bill: req.body.bill,
    supplyOrder: req.body.supplyOrder,
    measurement: req.body.measurement,
    image: req.body.image,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      /// Create a new folder in public called uploads_"_id"
      const folderName = `uploads_${createdModel._id}`;
      const folderPath = path.join(__dirname, '../public', folderName);

      fs.mkdir(folderPath, (err) => {
        if (err) {
          console.error("Error creating folder:", err);
        } else {
          console.log("Folder created successfully:", folderPath);
        }
      });
      // Redirect to the charts page
      res.redirect("/charts");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

//TODO C > Create new chart
//GET handler for /charts/add (loads)
router.get("/add",IsLoggedIn, (req, res, next) => {
  res.render("charts/add", { title: "Add a new Chart" });
});

//POST handler for /charts/add (receives input data)
router.post("/add", (req, res, next) => {
  Chart.create(
    {
      brnNum: req.body.brnNum,
      name: req.body.name,
      updateDate: req.body.updateDate,
      icdCode: req.body.icdCode,
      icdCode: req.body.icdCode,
      progressNote: req.body.progressNote,
      lhinUpdate: req.body.lhinUpdate,
      bill: req.body.bill,
      supplyOrder: req.body.supplyOrder,
      measurement: req.body.measurement,
      image: req.body.image,
    }, 
    (err, newChart) => {
      res.redirect("/charts");
    } 
  );
});

//GET - renders charts/amend view
router.get("/amend/:_id", IsLoggedIn, async (req, res, next) => {
  try {
    const chartObj = await Chart.findById(req.params._id).exec();
    const [icdCodeList, billList, supplyList] = await Promise.all([
      IcdCode.find().exec(),
      Bill.find().exec(),
      SupplyOrder.find().exec(),
    ]);
    res.render("charts/amend", {
      title: "Amend a Chart",
      chart: chartObj,
      icdCodes: icdCodeList,
      billing: billList,
      supplyOrders: supplyList,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
  }
});

// POST /charts/amendID, posts amended data
router.post("/amend/:_id", (req, res, next) => {
  Chart.findOneAndUpdate(
    { _id: req.params._id },
    {
      brnNum: req.body.brnNum,
      name: req.body.name,
      updateDate: req.body.updateDate,
      icdCode: req.body.icdCode,
      icdCode: req.body.icdCode,
      progressNote: req.body.progressNote,
      lhinUpdate: req.body.lhinUpdate,
      bill: req.body.bill,
      supplyOrder: req.body.supplyOrder,
      measurement: req.body.measurement,
      image: req.body.image,
    }
  )
    .then((updatedChart) => {
      res.redirect("/charts");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

//GET - renders charts/files page
router.get("/files/:_id", IsLoggedIn, async (req, res, next) => {
  try {
    res.render("charts/files", 
      {
      title: "Upload and View Files",
    });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

// POST /charts/fileID, posts new file uploads
router.post("/files/:_id", (req, res, next) => {
  try {
    const chartId = req.params._id;
    const fileBuffer = req.file.buffer;

    // Save the buffer to a dedicated directory for the specific chart
    const chartUploadDir = path.join(__dirname, "../uploads", chartId);
    if (!fs.existsSync(chartUploadDir)) {
      fs.mkdirSync(chartUploadDir);
    }

    const filePath = path.join(chartUploadDir, `${Date.now()}_${req.file.originalname}`);
    fs.writeFileSync(filePath, fileBuffer);

    res.redirect(`/charts/files/${chartId}`);
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

// DELETE
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let chartId = req.params._id;

  // Find chartId, then delete associated folder and chart object with associated chartIds
  Chart.findById(chartId)
    .then((chart) => {
      if (!chart) {
        return res.redirect("/error");
      }
      // Delete the associated folder
      const folderName = `uploads_${chart._id}`;
      const folderPath = path.join(__dirname, '../public', folderName);
      fs.rmdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error deleting folder:", err);
        } else {
          console.log("Folder deleted successfully:", folderPath);
        }
        Chart.deleteOne({ _id: chartId })
          .then(() => {
            res.redirect("/charts");
          })
          .catch((err) => {
            res.redirect("/error");
          });
      });
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
