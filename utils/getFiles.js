const fs = require("fs")
const { google } = require('googleapis')



const getFiles = async (client, PARENT_FOLDER = "1HEF6odZodvzRmEl63a2gY-cPcB4R0R95") => {
    

    const folderData = await client.files.list({
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        q: `mimeType = 'application/vnd.google-apps.folder' and '${PARENT_FOLDER}' in parents and trashed = false`,
        orderBy: "name",
    } );

    const fileData = await client.files.list({
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        q: `mimeType != 'application/vnd.google-apps.folder' and '${PARENT_FOLDER}' in parents and trashed = false`,
        orderBy: "name",
    } );
        

   

    return {
        folders: folderData.data.files,
        files: fileData.data.files,
    }
};



module.exports = getFiles;