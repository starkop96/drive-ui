

async function generatePublicUrl(drive,fileId) {
    try {
    //   const fileId = '';
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
        supportsAllDrives: true,
      });
      return result.data ;
      // console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
}


module.exports = generatePublicUrl ;