const PORT = process.env.PORT || 8080
const express = require("express")
const app = express()
const cors = require("cors")

//connect to mongoDB database ============================================
const mongoose = require('mongoose')
const connectionString = 'mongodb+srv://slopesAdmin:slopesAdmin@cluster0.ekiz0.mongodb.net/slopesDB?retryWrites=true&w=majority'
mongoose.connect(connectionString, { useNewUrlParser: true })


//middleware uses  ======================================================
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.json())
app.use(cors())


//routes ================================================================
app.get("/", (req, res)=> {
    res.render("index.ejs")
})

//open sever  ============================================================
app.listen(PORT, ()=>
    console.log("Currently listening on PORT:", PORT)
)