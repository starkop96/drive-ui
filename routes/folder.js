const express = require('express');
const router = express.Router();
const getFiles = require("../utils/getFiles");
const getAuth = require("../utils/authServiceAccount");


router.get("/:id",async (req,res) => {
    const FOLDER_ID = req.params.id ;
    const auth = await getAuth();
    const data =  await getFiles(auth,FOLDER_ID);
    res.render("index",{data: data});
})


module.exports = router ;