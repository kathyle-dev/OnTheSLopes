//APPENDING MY CONFIG VARIABLES TO process.env
require('dotenv').config()

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()

//middleware uses  ======================================================
app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.json());
app.use(cors());
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//connect to mongoDB database ============================================
const mongoose = require("mongoose");
const { Db } = require("mongodb");


var data;
mongoose.connect(process.env.CONNECTION_STRING, (err, db) => {
  if (err) return console.log(err);
  data = db;
});

app.post("/posts", (req, res) => {
  console.log(req.body + "Request body sent from POST");
  //   console.log(req.body.first_name + " was added by post on Server");
  data.collection("posts").insertOne(
    {
      email: req.body.email,
      text:  req.body.user_text,
      comments: [],
    },
    (error, result) => {
      if (error) return console.log(error);
      res.redirect("/");
    }
  );
});
app.get("/main", (req, res) => {
  console.log("Sent from Get on Server");
  data
    .collection("posts")
    .find()
    .toArray((error, result) => {
      if (error) return console.log(error);
      res.render("index.ejs", {
        posts: result || null,
      });
    });
});

// Route to the Welcome Page
app.get("/", (req, res) => {
    console.log("Sent from Get on Server");
    data
        .collection("posts")
        .find()
        .toArray((error, result) => {
            if (error) return console.log(error);
            res.render("welcome.ejs", {
                posts: result || null,
            });
        });
});

//open sever  ============================================================
app.listen(PORT, () => console.log("Currently listening on PORT:", PORT));
