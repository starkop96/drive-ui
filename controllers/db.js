const fs = require('fs');
const path = require("path");

class DB {
    constructor (){
        this.path = path.join(__dirname,"..","uploads","data.json")
        var data = JSON.parse(fs.readFileSync(this.path)) ;
        this.data = data.torrents;
        // console.log(this.data);
    };

    clearDB(){
        let data = {
            torrents: "",
        }
        fs.writeFileSync(this.path,JSON.stringify(data,null,"   "));
    }

    findEl(infoHash){
        var old_index = -1 ;
        // console.log(this.data);
        for (let i = 0; i < this.data.length; i++) {
            const el = this.data[i];
            if (el.infoHash == infoHash) {
                old_index = i;
                break
            }
        };
        return old_index ;
    }

    addData(stats) {
        console.log("Added to DB : ",stats.infoHash);
        const torrent = stats;
        if (this.findEl(stats.infoHash) == -1) {
            this.data.push(torrent);
            fs.writeFileSync(this.path,JSON.stringify({torrents: this.data},null,"  "));
        }
        
        return 0;
    }
    updateData(stats){
        const hash = stats.infoHash;
        const i = this.findEl(hash);
        this.data[i] = stats ;
        fs.writeFileSync(this.path,JSON.stringify({torrents: this.data},null,"  "));
        return 0 ;
    }

    getData(hash){
        const i = this.findEl(hash);
        if (i == -1) {
            return -1 ;
        }
        return this.data[i];
    }
}

module.exports = DB ;