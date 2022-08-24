const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const fs = require("fs");
const {google} = require('googleapis');


const getFiles = require("./utils/getFiles");
const getPublicURL = require('./utils/getPublicURL');
const checkAuth = require("./middleware/auth")
const uploadRoute = require("./routes/upload");
const foldersRoute = require("./routes/folder");
const filesRoute = require("./routes/file");
const getAuth = require('./utils/authServiceAccount');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("process.env.SECRET"));
app.use(checkAuth);

app.use("/upload",uploadRoute);
app.use("/folder",foldersRoute);
app.use("/file",filesRoute);

app.set("view engine","ejs");

app.get("/",async(req,res) => {
    
    if (req.isSignedIn) {
        
        const drive = getAuth() ;
        const data = await getFiles(drive);
        // console.log(data);
        res.render("index",{data:data})
    } else {
        res.render("login");
    }
})

app.post("/",(req,res) => {
    if (req.body.pass == process.env.PASS ) {
        res.cookie('cookie', 'test',{httpOnly: true,signed:true});
        res.cookie("session","pass",{signed: true, httpOnly: true,maxAge: 1000 * 60 * 15});
        res.redirect("/");
        return
    }
    res.send("Zyada chalaak banta h !!!");
})


app.get("/publicURL/:id", async (req,res) => {
    const file_Id = req.params.id ;
    const drive = getAuth();
    const data = await getPublicURL(drive,file_Id);
    res.redirect(data.webViewLink);
})

app.get("/logout",(req,res) => {
    
    res.cookie("session","");
    res.cookie('cookie', "");
    res.redirect("/");
})

app.listen(process.env.PORT,(e) => {
    if (e) {
        console.log(e);
    }
    console.log(`Server Running on port ${process.env.PORT}`);
})

