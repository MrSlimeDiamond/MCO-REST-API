const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const morgan = require("morgan");
const mcu = require("minecraft-server-util");
const fs = require("fs");
const path = require('path');
const app = express();
const config = require("./config.json")
app.use(express.json());
app.listen(
    config.port, () => {
        console.log("Listening on htt://localhost:" + config.port);
    }
);
async function getMcoAPI(script, argument) { // Made by IconPippi
    let output;
    output = await new Promise((resolve, reject) => {
        request("https://minecraftonline.com/cgi-bin/" + script + "?" + argument, (error, response, html) => {
            let $ = cheerio.load(html.toString());
            if (!error)
                resolve($.text().trim());
            else
                reject("Error occurred!");
        });

    });
    return output;
}

app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));

app.get("/player/:username", async (req, res) => {
    const { username } = req.params;
    const correctname = await getMcoAPI("getcorrectname", username);
    const playtime = await getMcoAPI("gettimeonline", correctname);
    const firstseen = await getMcoAPI("getfirstseen_unix", correctname);
    const lastseen = await getMcoAPI("getlastseen_unix", correctname);
    const playerinfo = await getMcoAPI("getplayerinfo", correctname);
    const isBanned = !playerinfo.includes("NOTBANNED");

    if (correctname == "NOTFOUND") {
        res.status(400).send({
            "error": "Could not find player"
        })
    } else {
        res.status(200).send({
            "username": correctname,
            "playtime": playtime,
            "firstseen": firstseen,
            "lastseen": lastseen,
            "isBanned": isBanned
        });
    }
});

app.get("/api/mco/player/:username", async (req, res) => {
    const { username } = req.params;
    const correctname = await getMcoAPI("getcorrectname", username);
    const playtime = await getMcoAPI("gettimeonline", correctname);
    const firstseen = await getMcoAPI("getfirstseen_unix", correctname);
    const lastseen = await getMcoAPI("getlastseen_unix", correctname);
    const playerinfo = await getMcoAPI("getplayerinfo", correctname)
    const isBanned = !playerinfo.includes("NOTBANNED");

    if (correctname == "NOTFOUND") {
        res.status(400).send({
            "error": "Could not find player"
        })
    } else {
        res.status(200).send({
            "username": correctname,
            "playtime": playtime,
            "firstseen": firstseen,
            "lastseen": lastseen,
            "isBanned": isBanned
        });
    }
});

app.get("/api/mco/playtime/:username", async (req, res) => {
    const { username } = req.params
    const correctname = await getMcoAPI("getcorrectname", username)
    const playtime = await getMcoAPI("gettimeonline", correctname)

        if (correctname == "NOTFOUND") {
            res.status(400).send({
                "error": "Could not find player"
        })
    } else {
        res.status(200).send({
            "playtime": playtime
        })
    }
})

app.get("/api/mco/firstseen/:username", async (req, res) => {
    const { username } = req.params
    const correctname = await getMcoAPI("getcorrectname", username)
    const firstseen = await getMcoAPI("getfirstseen_unix", correctname)

        if (correctname == "NOTFOUND") {
            res.status(400).send({
                "error": "Could not find player"
        })
    } else {
        res.status(200).send({
            "firstseen": firstseen
        })
    }
})

app.get("/api/mco/lastseen/:username", async (req, res) => {
    const { username } = req.params
    const correctname = await getMcoAPI("getcorrectname", username)
    const lastseen = await getMcoAPI("getlastseen_unix", correctname)

        if (correctname == "NOTFOUND") {
            res.status(400).send({
                "error": "Could not find player"
        })
    } else {
        res.status(200).send({
            "lastseen": lastseen
        })
    }
})

app.get("/bancount", async (req, res) => {

    const bancount = await getMcoAPI("getbancount.sh");
    res.status(200).send({
        "bancount": bancount
    });
});

app.get("/api/mco/bancount", async (req, res) => {
    
    const bancount = await getMcoAPI("getbancount.sh");
    res.status(200).send({
        "bancount": bancount
    });
});

app.get("/getbaninfo/:username", async (req, res) => {
    const { username } = req.params;
    const correctname = await getMcoAPI("getcorrectname", username);
    const playerinfo = await getMcoAPI("getplayerinfo", correctname);
    const isBanned = !playerinfo.includes("NOTBANNED");

    if (correctname == "NOTFOUND") {
        res.status(400).send({
            "error": "Could not find player"
        });
        return;
    }

    if (isBanned == false) {
        res.status(200).send({
            "isBanned": isBanned
        });
    } else {
        // player is banned
        const playerinfo_split = playerinfo.split(/\r?\n/);
        const ban = playerinfo_split[3].split(";");
        const banWho = ban[0];
        const banWhy = ban[2];
        const banWhen = ban[1];
        res.status(200).send({
            "isBanned": isBanned,
            "banWho": banWho,
            "banWhy": banWhy,
            "banWhen": banWhen
        });
        // res.status(500).send({
        //     "error": "not implemented RIP BOZO"
        // });
    }

});

app.get("/api/mco/getbaninfo/:username", async (req, res) => {
    const { username } = req.params;
    const correctname = await getMcoAPI("getcorrectname", username);
    const playerinfo = await getMcoAPI("getplayerinfo", correctname);
    const isBanned = !playerinfo.includes("NOTBANNED");

    if (correctname == "NOTFOUND") {
        res.status(400).send({
            "error": "Could not find player"
        });
        return;
    }

    if (isBanned == false) {
        res.status(200).send({
            "isBanned": isBanned
        });
    } else {
        // player is banned
        const playerinfo_split = playerinfo.split(/\r?\n/);
        const ban = playerinfo_split[3].split(";");
        const banWho = ban[0];
        const banWhy = ban[2];
        const banWhen = ban[1];
        res.status(200).send({
            "isBanned": isBanned,
            "banWho": banWho,
            "banWhy": banWhy,
            "banWhen": banWhen
        });
        // res.status(500).send({
        //     "error": "not implemented RIP BOZO"
        // });
    }

});

app.get("/playerlist", async (req, res) => {
    mcu.status("minecraftonline.com").then((response) => {
        res.status(200).send(response.players.sample);
    });
});

app.get("/api/mco/playerlist", async (req, res) => {
    mcu.status("minecraftonline.com").then((response) => {
        res.status(200).send(response.players.sample);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/api/mco", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});