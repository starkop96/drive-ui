const express = require('express');
const { file } = require('googleapis/build/src/apis/file');
const router = express.Router();
const multer = require('multer');
const getAuth = require('../utils/authServiceAccount');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    // filename: (req,file,cb) => {
    //     cb(null,file.originalname);
    // }
})
const upload = multer({ storage: storage });


router.get("/", (req, res) => {
    res.render("upload");
})

router.post("/", upload.single('file'), async (req, res) => {
    // console.log(req.file.originalname);
    if (!req.file) {
        res.send("Bhai select to kar");
        return
    }
    const drive = getAuth();

    var metaData = {
        name: req.file.originalname,
        driveId: "0ALc6OebpravSUk9PVA",
        mimeType: req.file.mimetype,
        parents: ['1HEF6odZodvzRmEl63a2gY-cPcB4R0R95']
    }

    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);

    var media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(filePath),
    }

    const ans = await drive.files.create({
        resource: metaData,
        media: media,
        // fields: 'id',
        supportsAllDrives: true,
        supportsTeamDrives: true,
    }).then(() => {
        fs.unlink(filePath, (e) => { if (e) { console.log(e) } });
    });
    // console.log(ans);

    res.render("upload");
})

module.exports = router;