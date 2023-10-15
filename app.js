const express = require("express");
const bodyparser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const IP = require("ip");
const nodemailer = require("nodemailer");
const os = require("os");
const si = require("systeminformation");
const app = express();
app.use(bodyparser.json());
const port = 5000;
const path = require("path");
const User = require("./Modals/userSchema");
//serving static files
app.use(express.static("public")); //to use public folder
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
const homeRouter = require("./routes/homeroute");
const newsRouter = require("./routes/newsroute");
const chatRouter = require("./routes/chatRoutes");
const { connect } = require("http2");

app.use("/", homeRouter);
app.use("/article", newsRouter);
app.use("/chat", chatRouter);

app.get("/audio", (req, res) => {
  res.render("audio");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/ebook", (req, res) => {
  res.render("ebook");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
// let db = mongoose.connection; // this db is not working. Enter your db here
// db.once("open", () => {
//   console.log("successfully connected");
// });
// db.on("err", () => {
//   console.log("error in connecting to database");
// });
let connection;

const connectDB = async () => {
  try {
    connection = await mongoose.connect(
      "<MONGO_URL>",
      {
        useNewUrlParser: true,
      }
    );
    console.log("MongoDB connected: " + connection.connection.host);
  } catch (err) {
    console.log("Error: " + err.message);
    process.exit();
  }
};
connectDB();
app.get("/signup_success", (req, res) => {
  res.render("signup_success");
});
app.post("/signup", (req, res) => {
  console.log("Hii");
  var name = req.body.name;
  var email = req.body.email;
  var tech_stack = req.body.tech_stack;
  var purpose = req.body.purpose;
  const newUser = new User({
    name: name,
    email: email,
    tech_stack: tech_stack,
    purpose: purpose,
  });
  console.log("database");
  newUser.save((err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log("user saved");
      sendmail(email, "You have successfully signed up at Tech mirror");
      res.redirect("/signup_success");
    }
  });
});

async function sendmail(email, bodystring) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "mirrortech8@gmail.com",
        pass: "wrul wxov fvyd fvmv",
      },
    });
    const data = await si.system();
    const mailOptions = {
      from: "mirrortech8@gmail.com",
      to: email,
      subject: "New login at Tech mirror",
      html:
        "<h1>From Tech mirror</h1><h2>" +
        bodystring +
        "</h2>" +
        "<h3>System Information:</h3>" +
        "<h4>IP: " +
        IP.address() +
        "</h4><h4>Operating System: " +
        os.platform() +
        "</h4><h4>Version: " +
        os.version() +
        "</h4><h4>Manufacturer: " +
        data.manufacturer +
        "</h4><h4>Model: " +
        data.model +
        "</h4>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email has been sent");
      }
    });
  } catch (error) {
    console.log(error);
  }
}
app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
