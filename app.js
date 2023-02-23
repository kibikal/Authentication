//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.set({ strictQuery: false });
mongoose
  .connect(
    "mongodb+srv://kibikal:restoration2019@cluster0.rfmhhdi.mongodb.net/users?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const userTemplateCopy = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  const newUser = new userTemplateCopy({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    err ? console.log(err) : res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  userTemplateCopy.findOne({ email: userName }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      foundUser.password === password
        ? res.render("secrets")
        : res.send("Incorrect password, please try again!");
    }
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
