//1. EXPRESS
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const multer = require('multer');
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//2. DATABASE MongoDB CONNECTIONS
const config = require("./config/globals");
let connectionString = config.db;
var mongoose = require("mongoose");
//Configure mongoose (initial database connection)
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((message) => {
    console.log("Connected successfully!");
  }) 
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  }); 

//3. AUTHENTICATION
var passport = require("passport");
var session = require("express-session");
const githubStrategy = require("passport-github2").Strategy;
var User = require("./models/user"); 

//Configure session handling
app.use(
  session({
    secret: "patientChartOnline",
    resave: false,
    saveUninitialized: false,
  })
);
//Configure passport module
app.use(passport.initialize());
app.use(passport.session());
//Configure local strategy method
passport.use(User.createStrategy()); 
// Configure passport-github2 with the API keys and user model
passport.use(
  new githubStrategy(
    {
      clientID: config.github.clientId,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: "Github",
          created: Date.now(),
        });
        // add to DB
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);
//Set passport to write/read user data to/from session object 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//4. IMAGE UPLOAD AND VIEW --> files are locally uploaded (or on Cloud hosting service ie. Azure)
//Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file views
app.get('/charts/files/:_id', (req, res) => {
  // Get the list of uploaded files associated with specific chart
  const chartId = req.params._id;
  const fileList = getUploadedFiles(chartId);
  // Render files for each specific chartId
  res.render('charts/files', { title: 'Uploaded Files', chartId, fileList });
});

//Upload files with chartId name formatting for specific chart identification
app.post('/charts/files/:_id', upload.single('file'), (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const chartId = req.params._id;
    // Append chartId to the original filename to create chart respective files with the same id
    // needed for dynamic file viewing
    const newFileName = `${chartId}_${req.file.originalname}`;
    const filePath = path.join(__dirname, 'public', `uploads_${chartId}`, newFileName);

    require('fs').writeFileSync(filePath, fileBuffer);
    res.redirect(`/charts/files/${chartId}`);
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

//Set up a dynamic route to view files based on chartId and filename
app.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  // Extract chartId from filename
  const chartId = filename.split('_')[0];
  // Concatenate chartId to 'uploads_'
  const filePath = path.join(__dirname, 'public', `uploads_${chartId}`, filename);
  console.log('File Path:', filePath);
  // Send the file for viewing
  res.sendFile(filePath);
});

// Helper function to get a list of uploaded files for a specific chart
function getUploadedFiles(chartId) {
  const uploadDir = path.join(__dirname, 'public', `uploads_${chartId}`);
  const fileList = require('fs').readdirSync(uploadDir);
  return fileList;
}

//5. ROUTER OBJECTS
var indexRouter = require("./routes/index");
var chartsRouter = require("./routes/charts");
var icdCodesRouter = require("./routes/icdCodes");
var billingRouter = require("./routes/billing");
var supplyOrderRouter = require("./routes/supplyOrders");
//ROUTING CONFIGURATIONS
app.use("/", indexRouter);
app.use("/charts", chartsRouter);
app.use("/icdCodes", icdCodesRouter);
app.use("/billing", billingRouter);
app.use("/supplyOrders", supplyOrderRouter);

//HBS Helper Functions
var hbs = require("hbs");
//icdCode, billing, & supplyOrder HELPER (CREATES OPTION VALUE FROM HOST MODEL)
hbs.registerHelper("createOptionElement", (listValue, selectedValue) => {
  let selectedProperty = ""; //empty by default
  if (listValue == selectedValue) {
    selectedProperty = "selected";
  }
  let optionElement = `<option ${selectedProperty}>${listValue}</option>`;
  return new hbs.SafeString(optionElement);
});

//ROUTING ERRORS
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
