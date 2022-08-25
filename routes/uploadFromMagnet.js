const express = require('express');
const router = express.Router();
const WebTorrent = require('webtorrent');
const path = require("path");
const getAuth = require('../utils/authServiceAccount');
const parseTorrent = require('parse-torrent')
const fs = require('fs');

const DB = require("../controllers/db");



const db = new DB();


const opts = {
    connections: 1000,
    uploads: 1,
    tmp: path.join(__dirname,"..","uploads","tmp"),
    path: path.join(__dirname,"..","uploads","tmp"),
    verify: true,
    dht: true,
    tracker: true,
    trackers: []
};

var torrentClient = new WebTorrent(opts);


const fileUploader = async (drive, fileName, parentFolder, stream) => {
    var metaData = {
        name: fileName,
        driveId: "0ALc6OebpravSUk9PVA",
        parents: [parentFolder],
    };

    var media = {
        body: stream,
    }

    var id = null;

    const ans = await drive.files.create({
        resource: metaData,
        media: media,
        // fields: 'id',
        supportsAllDrives: true,
        supportsTeamDrives: true,
    }).then((data) => {
        id = data.data.id;
    });
    return id
}

async function downloadTorrent(link) {
    var torrent = torrentClient.add(link, async (torrent) => {

        db.addData({
            name: torrent.name,
            infoHash: torrent.infoHash,
            progress: (torrent.progress * 100).toFixed(2) + '%',
            timeRemaining: (torrent.timeRemaining / 1000).toFixed(0),
            downloaded: (torrent.downloaded / (1024 * 1024)).toFixed(3) + ' MB',
            speed: (torrent.downloadSpeed / (1024 * 1024)).toFixed(3) + ' MB/sec',
            totalSize: (torrent.length / (1024 * 1024)).toFixed(3) + ' MB',
        });

        var interval = setInterval(() => {
            let stats = {
                name: torrent.name,
                infoHash: torrent.infoHash,
                progress: (torrent.progress * 100).toFixed(2) + '%',
                timeRemaining: (torrent.timeRemaining / 1000).toFixed(0),
                downloaded: (torrent.downloaded / (1024 * 1024)).toFixed(3) + ' MB',
                speed: (torrent.downloadSpeed / (1024 * 1024)).toFixed(3) + ' MB/sec',
                totalSize: (torrent.length / (1024 * 1024)).toFixed(3) + ' MB',
            }
            // console.log(stats);
            db.updateData(stats);

        }, 1000);

        torrent.on('done', () => {
            console.log("Completed", torrent.infoHash);
            let stats = {
                name: torrent.name,
                infoHash: torrent.infoHash,
                progress: "100" + '%',
                timeRemaining: 0,
                downloaded: (torrent.length / (1024 * 1024)).toFixed(3) + ' MB',
                speed: (torrent.downloadSpeed / (1024 * 1024)).toFixed(3) + ' MB/sec',
                totalSize: (torrent.length / (1024 * 1024)).toFixed(3) + ' MB',
            };
            db.updateData(stats);
            clearInterval(interval);
        });
        const drive = getAuth();
        const folderN = torrent.name;

        const fileMetadata = {
            'name': folderN,
            'mimeType': 'application/vnd.google-apps.folder',
            'driveId': "0ALc6OebpravSUk9PVA",
            'parents': ["1HEF6odZodvzRmEl63a2gY-cPcB4R0R95"],
        };

        var folderID = null;
        try {
            let file = await drive.files.create({
                resource: fileMetadata,
                fields: 'id',
                supportsAllDrives: true,
                supportsTeamDrives: true,
            });
            console.log('Folder Id:', file.data.id);
            folderID = file.data.id;
        } catch (err) {
            console.log(err);
        }

        var files = torrent.files;
        var length = files.length
        files.forEach(async (file) => {
            const source = file.createReadStream()
            await fileUploader(drive, file.name, folderID, source);

            length = length - 1
            if (!length) {
                torrentClient.remove(link, () => {
                    console.log("Torrent Uploaded and Destroyed");
                })
                return
            }
        });
    });
};



router.get("/", (req, res) => {
    res.render("magnet", { data: false , hash: ""});
});

router.post("/", (req, res) => {
    const link = req.body.link;

    const info = parseTorrent(link);
    const hash = info.infoHash ;

    downloadTorrent(link);

    res.render("magnet", { data: true , hash: hash });
});

router.get("/stats/:hash", (req, res) => {
    const hash = req.params.hash;
    const stats = db.getData(hash);
    if (stats == -1) {
        res.json({ error: "ID galat h vro", code: 404 });
        return;
    }
    res.json(stats);
});


module.exports = router;