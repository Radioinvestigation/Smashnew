const config = require("../config.json");
const client = require("./bot.js");

const db = require("./database");
const moment = require("moment");

module.exports =  {
    isLoggedIn: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.dj) || role.has(config.discord.headdj) || role.has(config.discord.manager) || role.has(config.discord.admin) || role.has(config.discord.dev) || role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    },
    isDJ: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.dj) || role.has(config.discord.headdj) || role.has(config.discord.manager) || role.has(config.discord.admin) || role.has(config.discord.dev) || role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    },
    isHeadDJ: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.headdj) || role.has(config.discord.manager) || role.has(config.discord.admin) || role.has(config.discord.dev) || role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    },
    isManager: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.manager) || role.has(config.discord.admin) || role.has(config.discord.dev) || role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    },
    isAdmin: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    let adminCheck = false;
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.admin) || role.has(config.discord.dev) || role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    let adminCheck = true;
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    let adminCheck = false;
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                let adminCheck = false;
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    },
    isDev: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.dev) || role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    },
    isOwner: async function (req, res, next) {
        if(req.isAuthenticated()) {
            const guild = client.guilds.cache.get(config.discord.guild)
            const user = guild.members.cache.get(req.user.id)
            const log = client.channels.cache.get(config.discord.log)
            if(user){
                const role = user.roles.cache
                if(!guild.member(req.user.id)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                }
                if(user.id === "591865042996297729") {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/").replace("//", "/")}`)
                    return next()
                }
                if(role.has(config.discord.owner)) {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) successfully authenticated ${req.url.replace("//", "/")}`)
                    return next()
                } else {
                    log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                    return res.redirect("/login")
                } 
            } else {
                log.send(`\`${req.user.username}#${req.user.discriminator}\` (${req.user.id}) failed authenticated ${req.url.replace("//", "/")}`)
                return res.redirect("/login")
            }
        }
        return res.redirect("/login")
    }
};
