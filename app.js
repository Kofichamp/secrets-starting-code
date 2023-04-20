//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://kofi:emma1234@cluster0.jfidjsp.mongodb.net/Secret_APP?retryWrites=true&w=majority");


const userSchema = new mongoose.Schema({ 
    email: String,
    password: String
    });
    
    // This is the plugin that encrypts the password
    // The secret is the key that encrypts the password
    // The encryptedFields is the field that is encrypted
    
    const secret = process.env.SECRET;

    userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

    const User = new mongoose.model("User", userSchema);
    

app.get("/", function(req, res) {   
    res.render("home");
    });

    app.get("/login", function(req, res) {
    res.render("login");
    });

    app.get("/register", function(req, res) {
    res.render("register");
    });

app.post("/register", async (req,res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    // Dont use call back function here 
    await newUser.save();
    try {
        res.render("secrets");
    } catch (error) {
        console.log(error);
    }
    
    });

    app.post("/login", async function(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const foundUser = await User.findOne({email: username});
            if (foundUser && foundUser.password === password) {
                res.render("secrets");
            }
        } catch (err) {
            console.log(err);
        }
    });
    
app.listen(3000, function() {
    console.log("Server started on port 3000");
    });