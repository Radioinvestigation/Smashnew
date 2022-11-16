const Discord = require("discord.js")
const config = require('../config.json');
const chalk = require('chalk');
const axios = require("axios")
const client = new Discord.Client({ fetchAllMembers: true });
console.log(`${chalk.blueBright("[BOT]")}${chalk.greenBright("[INFO]")} Loading Discord Bot`);
client.login(config.bot.token).catch(error => {
        console.error(`${chalk.blueBright("[BOT]")}${chalk.redBright("[ERROR]")} Discord Bot: Failed to authenticate with discord.`)
        process.exit(1);
});
const database = require("../modules/database.js")

client.on("ready", async () => {
  console.log(`${chalk.blueBright("[BOT]")}${chalk.greenBright("[INFO]")} Discord Bot Connected. Logged in as ${client.user.username}#${client.user.discriminator}`);
  console.log(`${chalk.blueBright("[BOT]")}${chalk.greenBright("[INFO]")} Loaded.`);

  const getP = () => {
	axios.get("https://api.itssmash.net/stats").then(res => {
		client.user.setActivity(res.song.title + " by " + res.song.artist, { type: 'LISTENING' })
	}).catch(error => {
    if(error) {
      client.user.setActivity("staff team", { type: 'WATCHING' })
    }
  })
  }
  setInterval(getP, 5000)
  getP()
});

module.exports = client;
