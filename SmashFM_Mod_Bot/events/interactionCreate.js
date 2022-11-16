const client = require("../index");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  await interaction.deferReply().catch(() => {});
  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  try {
    await command.run(client, interaction);
  } catch (error) {
    console.log(error);
    await interaction.followUp({
      content:
        "Oh no! I encountered a strange error.",
      ephemeral: true,
    });
  }
});
