const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const cors = require("cors");

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
const database = require("./config/database");

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
      fname: req.body.first,
      lname: req.body.last,
    },
    (error, result) => {
      if (error) return console.log(error);
      res.redirect("/");
    }
  );
});
app.get("/", (req, res) => {
  console.log("Sent from Get on Server");
  data
    .collection("posts")
    .find()
    .toArray((error, result) => {
      if (error) return console.log(error);
      res.render("index.ejs", {
        name: result || null,
      });
    });
});

//open sever  ============================================================
app.listen(PORT, () => console.log("Currently listening on PORT:", PORT));
