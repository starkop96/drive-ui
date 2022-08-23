const express = require('express');
const router = express.Router();
const getFiles = require("../utils/getFiles");
const getAuth = require("../utils/authServiceAccount");
const {google} = require('googleapis');

const getFileData = async (id) => {
    const auth = await getAuth();

    var {data} = await auth.files.get({
        fileId: id,
        supportsAllDrives: true,
        supportsTeamDrives: true,
        fields: "id,name,mimeType,modifiedTime,size,fileExtension"
    });
    // console.log(data);
    return data ;
};

router.get("/:id",async (req,res) => {
    const FILE_ID = req.params.id ;
    
    data = await getFileData(FILE_ID);

    // data.fullName = data.name ;
    // data.name = data.name.replace("."+data.fileExtension, "") ;
    if (parseInt(data.size) > 1048576){
        data.size = Math.ceil(data.size / 1048576);
        data.size = data.size.toString() + " MB"
    } else {
        data.size = Math.ceil(data.size / 1024)  ;
        data.size = data.size.toString() + " KB" ;
    }
    // console.log(data);
    // const data =  await getFiles(auth,FOLDER_ID);

    res.render("file",{data:data});
});

router.get("/download/:id",async (req,res) => {
    const FILE_ID = req.params.id ;
    const drive = await getAuth();


    try {
        const fileData = await getFileData(FILE_ID);
        var fileName = fileData.name ;
        var fileMime = fileData.mimeType ;

        res.setHeader("Content-disposition",'attachment; filename=' + fileName);
        res.setHeader('Content-type', fileMime);
        res.setHeader('Content-Length',fileData.size);

        const file = await drive.files.get({
            fileId: FILE_ID,
            alt: "media",
            // headers: { "Range": "bytes=500-999" },
        }, {
            responseType: "stream",
        },(err, {data} ) => {
            data.on('end',()=>{}).on(
                'error', (err) => console.log('Error : ', err)
            ).pipe(res);
        });
    } catch (e) {
        console.log(e);
    };

});


module.exports = router ;