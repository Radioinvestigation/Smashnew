const express = require('express');
const passport = require('passport');
const config = require('../config.json');
const auth = require('../modules/authCheck.js')
const database = require('../modules/database.js')
const client = require("../modules/bot.js");
const axios = require("axios")
global.router = express.Router();

router.get('/login', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/login',
}), function (req, res) {
  res.redirect('/Core.Home'); 
});

router.get('/', function(req, res, next) {
    return res.redirect('/Core.Home');
})

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login')
});

router.get('/Core.Home', auth.isLoggedIn, function(req, res, next) {
  let myGuild = client.guilds.cache.get(config.discord.guild);
  let memberCount = myGuild.members.cache.filter(member => !member.user.bot).size;
  database.query("SELECT COUNT(id) AS slots FROM timetable WHERE booked_by='" + req.user.username + "'", (err, rows) => {
    res.render("pages/Core/dashboard.ejs", { user: req.user, slots: rows, memberCount })
  })
})

router.get('/Core.Rules', auth.isDJ, function(req, res, next) {
  res.render("pages/Core/rules.ejs", { user: req.user })
})

router.get('/Radio.Timetable', auth.isDJ, async function(req, res, next) {
  const response = await axios.get(config.base + "/api/timetable")
  database.query("SELECT * FROM timetable;", (err, rows) => {
    res.render("pages/Radio/timetable.ejs", { user: req.user, data: response.data })
  })
})

router.get('/Radio.Requests', auth.isDJ, function(req, res, next) {
  database.query("SELECT * FROM requests WHERE deleted=0;", (err, rows) => {
    if(rows) {
      res.render("pages/Radio/requests.ejs", { user: req.user, rows: rows })
    } else {
      const rows = [
        {
          id: -1,
          username: "AutoDJ",
          title: "No",
          artist: "Requests",
          message: "Found!",
          deleted: 0
        }
      ]
      res.render("pages/Radio/requests.ejs", { user: req.user, rows: rows })
    }
  })
})

router.get('/Radio.Connect', auth.isDJ, function(req, res, next) {
  database.query(`SELECT * FROM encoders WHERE user_id='${req.user.id}';`, (err, rows) => {
    if(rows) {
      const server = {
        type: config.serverType,
        addr: config.serverIP,
        port: config.serverPort
      }
      res.render("pages/Radio/encoder.ejs", { user: req.user, rows: rows, server })
    } else {
      const rows = [
        {
          id: -1,
          username: "Encoder Not Made",
          password: "lol"
        }
      ]
      const server = {
        type: config.serverType,
        addr: config.serverIP,
        port: config.serverPort
      }
      res.render("pages/Radio/encoder.ejs", { user: req.user, rows: rows, server})
    }
  })
})

router.get('/Radio.Banned', auth.isDJ, function(req, res, next) {
  database.query("SELECT * FROM banned_songs;", (err, rows) => {
    res.render("pages/Radio/banned.ejs", { user: req.user, rows: rows })
  })
})

router.get('/Radio.Shows', auth.isDJ, function(req, res, next) {
  res.render("pages/Radio/permshows.ejs", { user: req.user })
})

router.get('/Radio.Imaging', auth.isDJ, function(req, res, next) {
  res.render("pages/Radio/imaging.ejs", { user: req.user })
})

router.get('/Head.Training', auth.isHeadDJ, function(req, res, next) {
  res.render("pages/Head/training.ejs", { user: req.user })
})

router.get('/Head.Guide', auth.isHeadDJ, function(req, res, next) {
  res.render("pages/Head/guides.ejs", { user: req.user })
})

router.get('/Manager.DNH', auth.isManager, function(req, res, next) {
  res.render("pages/Manager/dnhlist.ejs", { user: req.user })
})

router.get('/Admin.Create', auth.isAdmin, function(req, res, next) {
  database.query("SELECT * FROM timetable;", (err, rows) => {
    res.render("pages/Admin/create.ejs", { user: req.user, rows: rows })
  })
})

router.get('/Admin.Delete', auth.isAdmin, function(req, res, next) {
  database.query("SELECT * FROM encoders;", (err, rows) => {
    res.render("pages/Admin/delete.ejs", { user: req.user, rows: rows })
  })
})

router.get('/Admin.Ban', auth.isAdmin, function(req, res, next) {
  res.render("pages/Admin/ban.ejs", { user: req.user })
})

router.get('/Admin.Reset', auth.isAdmin, function(req, res, next) {
  res.render("pages/Admin/reset.ejs", { user: req.user })
})

router.get('/Admin.AddDNH', auth.isAdmin, function(req, res, next) {
  res.render("pages/Admin/dnh.ejs", { user: req.user })
})

module.exports = router;