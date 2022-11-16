const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const globPromise = promisify(glob);
const { token, clientId, guildId } = require("../config.json");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const commands = await globPromise(`${process.cwd()}/commands/*/*.js`);

  const array = [];
  commands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.commands.set(file.name, file);
    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    array.push(file);
  });
  client.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(token);

    if (client.user.id === clientId) {
      rest
        .put(Routes.applicationGuildCommands(clientId, guildId), {
          body: array,
        })
        .then(() => console.log("[SmashFM-ModBot] - Registered Guild Commands"))
        .catch(console.error);
    } else {
      rest
        .put(Routes.applicationCommands(clientId), { body: array })
        .then(() => console.log("[SmashFM-ModBot] - Registered Global Commands"))
        .catch(console.error);
    }
  });
};
