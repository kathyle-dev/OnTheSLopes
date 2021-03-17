const mongoose = require("mongoose")
const bcrypt = require("bcrypt") //this will help generate has for passwords

//define the schems for the user model
var userSchema = mongoose.Schema({
    local:{
        email: String,
        password: String
    }
});

//generate a hash for passwords
userSchema.methods.generateHash = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

//checking if password is valid
userSchema.methods.validPassword = (password, user) => {
    console.log(user.local, "THIS IS THE USER PASSED IN")
    return bcrypt.compareSync(password, user.local.password);
}

//create a model and export it to our app for use
module.exports = mongoose.model("User", userSchema)