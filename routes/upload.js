const express = require('express');
const { file } = require('googleapis/build/src/apis/file');
const router = express.Router();
const multer = require('multer');
const getAuth = require('../utils/authServiceAccount');
const fs = require('fs');
const path = require('path');
const uploader = require("../controllers/drive");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    // filename: (req,file,cb) => {
    //     cb(null,file.originalname);
    // }
});
const upload = multer({ storage: storage });


router.get("/", (req, res) => {
    res.render("upload");
})

router.post("/", upload.single('file'), async (req, res) => {

    // console.log( req.body);
    if (!req.file) {
        res.send("Bhai select to kar");
        return
    };
    
    if (!req.body.folder) {
        var folder = "1HEF6odZodvzRmEl63a2gY-cPcB4R0R95";
    } else {
        var folder = req.body.folder;
    };

    var ans = await uploader(req.file.originalname,req.file.mimetype,folder,req.file.filename) ;

    console.log("Uploaded : "+ ans);

    res.render("upload");
})

module.exports = router;