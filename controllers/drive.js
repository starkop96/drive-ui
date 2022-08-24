const fs = require('fs');
const path = require('path');
const getAuth = require("../utils/authServiceAccount");

const upload = async (fileName,mimeType,parentFolder="1HEF6odZodvzRmEl63a2gY-cPcB4R0R95",uploadedFileName) => {
    const drive = getAuth();

    var metaData = {
        name: fileName,
        driveId: "0ALc6OebpravSUk9PVA",
        mimeType: mimeType,
        parents: [parentFolder],
    };

    const filePath = path.join(__dirname, "..", "uploads", uploadedFileName);

    var media = {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
    }

    var id = null ;

    const ans = await drive.files.create({
        resource: metaData,
        media: media,
        // fields: 'id',
        supportsAllDrives: true,
        supportsTeamDrives: true,
    }).then((data) => {
        fs.unlink(filePath, (e) => { if (e) { console.log(e) } });
        // console.log(data);
        id = data.data.id ;
    });
    // console.log(id);
    return id
};



module.exports = upload ;

