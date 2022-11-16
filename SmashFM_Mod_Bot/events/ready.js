const client = require("../index");

client.on("ready", async () => {
  console.log(`[SmashFM-ModBot] Bot is up and ready to go!`);
  client.user.setActivity(`moderators.`, {
    type: "LISTENING",
  });
});
