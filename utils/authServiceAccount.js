const {google} = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID ;
const CLIENT_SECRET = process.env.CLIENT_SECRET ;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN ;

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const scopes= ['https://www.googleapis.com/auth/drive']


const getAuth = () => {
    // const auth = new google.auth.GoogleAuth({
    //     keyFile: "../service.json",
    //     scopes: ['https://www.googleapis.com/auth/drive']
    // });
    const auth = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
    auth.setCredentials({ refresh_token: REFRESH_TOKEN });
    
    const drive = google.drive({
        version: "v3",
        auth: auth
    });
    return drive
}

module.exports = getAuth ;