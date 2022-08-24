const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const checkAuth = (req,res,next) => {
    if (req.signedCookies.session == process.env.PASS) {
        req.isSignedIn = true ;
        next();
    } else{
        if (req.originalUrl == "/") {
            req.isSignedIn = false ;
            next();
        } else {
        req.isSignedIn = false ;
        res.send("Aisa mat kar bhai !!!");
        };
    }
    
}

module.exports = checkAuth ;