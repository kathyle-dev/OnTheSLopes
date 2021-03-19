//APPENDING MY CONFIG VARIABLES TO process.env
require("dotenv").config();

const fetch = require("node-fetch");
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectID
const multer = require('multer');

//middleware uses  ======================================================
app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.json());
app.use(cors());
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

//setting up passport needs for authentication   ===========================
const passport = require("passport");
const cookieParser = require("cookie-parser"); //used with express for session auth
const flash = require("connect-flash");
const session = require("express-session");

require("./config/passport")(passport); //now that passport is required above, send it to passport for configuration
app.use(cookieParser()); // to read cookies from express session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true, //forces the session to be saved back to session store
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); //for session-persistent authentication
app.use(flash()); //used for flash messages particularly with login/sign up messages

//connect to mongoDB database ============================================
const mongoose = require("mongoose");
const { Db, ObjectID } = require("mongodb");
const { response } = require("express");

var data;
mongoose.connect(process.env.CONNECTION_STRING, (err, db) => {
  if (err) return console.log(err);
  data = db;
});

// ========================================================================
//BACK END ROUTES FOR OUR AP ==============================================
// ========================================================================

//PASSPORT LOGIN AND SIGNUP AUTHENTICATION ROUTES

// LOGIN ==============================
// show the login form
app.get("/login", (req, res) => {
  res.render("login.ejs", { message: req.flash("loginMessage") });
});

// process the login form
app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/main", // redirect to the secure profile section
    failureRedirect: "/login", // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash
  })
);

// SIGN UP ==============================
// show the signup form
app.get("/signup", (req, res) => {
  res.render("signup.ejs", { message: req.flash("signupMessage") });
});

// process the signup form
app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/main", // redirect to the secure profile section
    failureRedirect: "/signup", // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash profile
  })
);

// LOGOUT ==============================
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// ===========================================
//OUR APP ROUTES ==============================

//UPLOAD IMAGES AND SAVE THEM IN OUR DATABASE =========================
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});
var upload = multer({storage: storage});

//adds a new Post to the database
app.post("/posts", upload.single('file-to-upload'), (req, res) => {
    let file = null
    if(typeof req.file !== "undefined")
        file = 'uploads/' + req.file.filename
    
  data.collection("posts").insertOne(
    {
      email: req.user.local.email,  
      poster_avatar: req.body.poster_avatar,
      text: req.body.user_text,
      location: req.body.location,
      category: req.body.category,
      picture: file,
      comments: [],
    },
    (error, result) => {
      if (error) return console.log(error);
      req.session.message = "post added!"
      res.redirect("/main");
    }
  );
});


//Route to the main page after authentication
app.get("/main", isLoggedIn, (req, res) => {
const user = req.user.local
const msg = req.session.message
  data
    .collection("posts")
    .find()
    .toArray((error, result) => {
      if (error) return console.log(error);
      
      res.render("index.ejs", {
        posts: result || null,
        user: user,
        msg: msg,
      });
    })
});

//Using Google Place Search API to find the nearest ski resorts within 200 mi of the user
app.get("/resorts", (req, res) => {
  console.log("Sent from Get on Server/resorts");
  var longitude = req.body.longitude
  var latitude = req.body.latitude
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=ski+resort&location=${latitude},${longitude}&radius=200&key=${process.env.GOOGLE_API}`)
    .then(response => response.json())
    .then(data => {
      let {results} = data
      res.send(results)
    })
});

// Route to the Welcome/ Home Page
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

//route to nearby resorts page
app.get("/nearby_resorts", (req, res) => {
  res.render("resorts.ejs");
});

//route to DELETE posts
app.delete("/delete", (req, res) =>{
    data.collection("posts").findOneAndDelete({_id: ObjectID(req.body.id)}, (error, result) => {
        if (error) return console.log(error)
        req.session.message = null
        res.status(200).send("Post Deleted!")
    })
})

//route to EDIT post
app.post("/edit", upload.single('file-to-upload'), (req, res) =>{
    let setObj = {
        email: req.body.email,
        text: req.body.user_text,
        location: req.body.location,
        category: req.body.category,
    }

    if(typeof req.file !== "undefined")
        setObj.picture = 'uploads/' + req.file.filename

    data.collection("posts")
    .findOneAndUpdate({_id: ObjectID(req.body.postId)}, {
        $set: setObj
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect("/main")
      })
})

//FILTERING METHOD ================================================

app.get("/posts", (req, res)=> {
    const user = req.user.local
    const queries = []
    Object.entries(req.query).forEach(([key,value])=> {
        if(value !== ""){
            let temp = {}
            temp[`${key}`] = value
            queries.push(temp)
        }
    })
    data.collection("posts")
    .find({$and: queries})
    .toArray((error, result) => {
         if (error) return console.log(error);
         res.render("index.ejs", {
           posts: result || null,
           user: user,
           msg: null,
          });
      });
    
})

// route middleware to ensure user is logged in ========================
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}

//open sever  ============================================================
app.listen(PORT, () => console.log("Currently listening on PORT:", PORT));
