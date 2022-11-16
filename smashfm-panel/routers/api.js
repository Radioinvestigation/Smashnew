const express = require('express');
const axios = require('axios');
const config = require('../config.json');
const auth = require('../modules/authCheck.js')
const database = require('../modules/database.js')
const crypto = require("crypto");
const client = require("../modules/bot.js")


global.router = express.Router();

router.post("/apply", function(req, res, next) {
    if(!req.body) return res.json({ response: false, message: "Missing Fields" })
    if(!req.body.name) return res.json({ response: false, message: "Missing Field: Discord" })
    if(!req.body.age) return res.json({ response: false, message: "Missing Field: Age" })
    if(!req.body.why) return res.json({ response: false, message: "Missing Field: Why" })
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    database.query(`SELECT * FROM applications WHERE ipAddr='${ip}';`, function(err, rows) {
        if(err) return res.json({ response: false, message: "Database Error!"})
        if(!rows || !rows[0]) {
            const embed = {
                "description": "Please react with a ✅ once accepted or ❌ once denied:",
                "timestamp": new Date().toUTCString(),
                "author": {
                  "name": "New Application!"
                },
                "fields": [
                  {
                    "name": "My Discord Username:",
                    "value": req.body.name
                  },
                  {
                    "name": "My Age:",
                    "value": `${req.body.age} years old`
                  },
                  {
                    "name": "Why I want to work for SmashFM:",
                    "value": req.body.why
                  }
                ]
              }
              client.channels.cache.get("936391179942105098").send({ embed: embed })
              database.query(`INSERT INTO applications (ipAddr, applied) VALUES ("${ip}", "true");`, (err, rows) => {
                  res.json({ response: true, message: "Application Sent! Keep your friend requests open!"})
              })
        } else {
            return res.json({ response: false, message: "You have already applied!"})
        }
    })
})

router.post('/timetable/:thing', auth.isDJ, function(req, res, next) {
    if(req.params.thing === "book") {
        database.query(`UPDATE timetable SET booked_by = '${req.body.booked_by}', avatar = '${req.body.booked_by_avatar}', booked_by_id = '${req.body.by}' WHERE time = '${req.body.time}' AND day = '${req.body.day}'`, function(err){
            if(err) {
                res.json("err")
                console.log(err)
            }
        })
        res.json("booked")
    } else if(req.params.thing === "unbook"){
        database.query(`UPDATE timetable SET booked_by = 'AutoDJ', avatar = 'https://i.imgur.com/gdBZHuF.png', booked_by_id = '1' WHERE time = '${req.body.time}' AND day = '${req.body.day}'`, function(err){
            if(err) {
                res.json("err")
                console.log(err)
            }
        })
        res.json("unbooked")
    }
})

// May not 100% work at the moment - will come back to this (Dan)

/* router.get("/nnl", function(req, res, next) {
    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
      }
      
      stringDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      
      var d = new Date()
      
      var nnl = {}
      nnl["now"] = new Date(d)
      nnl["next"] = new Date(d.addHours(1))
      nnl["later"] = new Date(d.addHours(1))
      
      finalJSON = {now:{},next:{},later:{}}
      
      for (let key in nnl) {
        nnl[key]["day"] = stringDays[nnl[key].getDay()]
        hours = nnl[key].getHours()
        if (hours < 10) {
          nnl[key]["hour"] = "0" + hours
        } else {
          nnl[key]["hour"] = hours
        }
        database.query('SELECT booked_by, avatar FROM timetable WHERE day = ? AND time = ?', [nnl[key]["day"],nnl[key]["hour"]+":00"], function(error, result){
          if (result) {
            finalJSON[key]["name"] = result[0].booked_by
            finalJSON[key]["av"] = result[0].avatar
            if (typeof finalJSON["later"]["av"] !== 'undefined'){
              res.json(finalJSON)
            }
          } else {
            console.log(error);
          }
        })
      }
}) */

router.post('/create/request', async(req, res) => {
    let name = req.body.name;
    let title = req.body.title;
    let artist = req.body.artist;
    let message = req.body.message;

    if(!name || !title || !artist || !message) {
        res.status(400);
        res.json({error: true, msg: "Please fill out all the fields!"})
    } else {
        database.query(`INSERT INTO requests (name, title, artist, message, deleted) VALUES ('${name}', '${title}', '${artist}', '${message}', 0)`);
        res.json({ error: false, msg: "Request has been sent!" });
    }
});

router.get('/delete/request/:id', auth.isDJ, function (req, res, next) {
    const id = req.params.id
    if (id === -1) return res.redirect('/Radio.Requests')
    database.query(`UPDATE requests SET deleted=1 WHERE id=${id}`, (err, rows) => {
        if (err) console.error(err)
        res.redirect('/Radio.Requests')
    })
})

router.get('/delete/encoder/:id', auth.isAdmin, function (req, res, next) {
    if (!req.params.id) return res.json({ error: "Encoder ID is not defined" });
    if (req.params.id === 1) res.json({
        error: "Cannot delete AutoDJ"
    })
    let sql = `SELECT * FROM encoders WHERE id = ${req.params.id};`
    database.query(sql, function (err, data) {
        if (data == undefined || data[0] == undefined) return res.json({ error: "Encoder cannot be found." });

        axios.delete(`${config.azura.base}/api/station/${config.azura.id}/streamer/${req.params.id}`, {
            headers: {
                'X-API-Key': `${config.azura.key}`
            }
        }).then(function (response) {
            let sql = `DELETE FROM encoders WHERE id = ${req.params.id};`
            database.query(sql, function (err, data) {
                res.send("success")
            })
        }).catch(function (err) {
            if (err) res.json("Error! Encoder not found in AzuraCast")
        })
    })
})

router.post('/create/encoder', auth.isAdmin, function (req, res, next) {
    database.query(`SELECT * FROM encoders WHERE user_id=${req.query.id}`, (err, rows) => {
        if(rows[0]) return res.json({error: true})
        if (!req.query.username) return res.send("Specify a username!")
        if (!req.query.id) return res.send("Specify a Discord ID!")
        avatar = `https://avatars.kie.lol/${req.query.id}`

        var pass = crypto.randomBytes(10).toString('hex');

        var things = {
            display_name: req.query.id,
            streamer_username: req.query.username,
            streamer_password: pass,
            comments: `Created by ${req.user.username}`,
            is_active: true,
            enforce_schedule: false
        }
        axios.post(`${config.azura.base}/api/station/${config.azura.id}/streamers`, things, {
            headers: {
                'X-API-Key': `${config.azura.key}`
            },

        }).then(function (response) {
            let sql = `INSERT INTO encoders (id, user_id, username, password, avatar) VALUES ('${response.data.id}', '${req.query.id}', '${req.query.username}', '${pass}', '${avatar}')`
            database.query(sql, function (err, data) {
                if (err) console.log(err)
                res.json({
                    error: false
                })
            })
        }).catch(error => {
            if (error) {
                res.json({
                    error: true
                })
                console.log(error)
            }
        })
    })
})

router.get("/timetable", function(req, res, next) {
    database.query("SELECT * FROM timetable", function(err, rows) {
      if(rows) {
        res.json(rows)
      } else {
        res.json({error: true})
      }
    })
  })

router.post('/ban/song', auth.isAdmin, function (req, res, next) {
    const query = req.query
    const sql = `INSERT INTO banned_songs (title, artist, reason) VALUES ('${query.title}', '${query.artist}', '${query.reason}')`
    database.query(sql, (err, rows) => {
        if (err) {
            res.json({
                error: true
            })
            console.log(error)
        }
        res.json({ error: false })
    })
});

router.post('/timetable/reset', auth.isAdmin, function (req, res, next) {
    const query = req.query
    const sql = `UPDATE timetable SET booked_by = 'AutoDJ', avatar = 'https://i.imgur.com/gdBZHuF.png', booked_by_id = '1' WHERE id != '0';)`
    database.query(sql, (err, rows) => {
        if (err) {
            res.json({
                error: true
            })
            console.log(err)
        }
        res.json({ error: false })
    })
});

let currentDJ;

router.get("/discord", async function(req,res,next) {
    axios.get("https://a.rize.services/api/nowplaying/3").then(symphony => {
    	const discord = client.channels.cache.get("935966357256802384").members.filter((m) => !m.user.bot && !m.voice.selfDeaf && !m.voice.serverDeaf).size
    	const unique = symphony.data.listeners.unique
    	const total = symphony.data.listeners.total
    	const current = symphony.data.listeners.current
    	res.json({
      		discord: discord,
      		unique: unique,
      		current: current,
      		total: current + discord
        })
    })
})

async function getDJ() {
    const { data } = await axios.get("https://a.rize.services/api/nowplaying/3")
    database.query(`SELECT * FROM encoders WHERE user_id="${data.live.streamer_name || "801148254900715542"}";`, function (error, rows) {
        currentDJ = rows
    })
}
getDJ()
setInterval(getDJ, 5000)

router.get("/currentDJ", async function (req, res, next) {
    res.json(currentDJ)
})

router.get("/checkAdmin", async (req, res) => {
    const client = require('../modules/bot');

    if (req.isAuthenticated()) {
        const guild = client.guilds.cache.get(config.discord.guild)
        const user = guild.members.cache.get(req.user.id)
        if (user) {
            const role = user.roles.cache
            if (!guild.member(req.user.id)) {
                res.json({ loggedIn: true, isAdmin: false });
            }
            if (role.has(config.discord.admin) || role.has(config.discord.owner)) {
                res.json({ loggedIn: true, isAdmin: true });
            } else {
                res.json({ loggedIn: true, isAdmin: false });
            }
        } else {
            res.json({ loggedIn: true, isAdmin: false });
        }
    } else {
        res.json({ loggedIn: false, isAdmin: false });
    }
});

module.exports = router;
