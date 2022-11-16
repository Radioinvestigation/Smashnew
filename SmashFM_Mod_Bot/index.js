const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
const { token, clientId, guildId } = require("./config.json");

module.exports = client;
client.commands = new Collection();

require("./handlers/slash")(client);
require("./handlers/events")(client);

client.login(token);
