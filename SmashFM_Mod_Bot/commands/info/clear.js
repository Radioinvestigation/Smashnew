const {
    SlashCommandBuilder
  } = require("@discordjs/builders");
  const {
    Client,
    CommandInteraction,
    MessageEmbed
  } = require("discord.js");
  const {
    glob
  } = require("glob");
  const {
    promisify
  } = require("util");
  
  const fs = require('fs');
  const globPromise = promisify(glob);
  const config = require(`${process.cwd()}/config.json`);
  
  module.exports = {
    ...new SlashCommandBuilder()
    .setName(`clear`)
    .setDescription(`Clear messages from the chat.`)
    .addIntegerOption((option) =>
      option
      .setName('amount')
      .setDescription('The amount of messages to clear (default: 100).')
      .setRequired(false)
    )
    .addChannelOption((option) =>
      option
      .setName('channel')
      .setDescription('The channel to purge from.')
      .setRequired(false)
    )
    ,
  
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    
    run: async (client, interaction, args) => {

      const isMod = config.moderator_roles.some(role => {
        return interaction.member.roles.cache.has(role)
      });
      
      if(isMod) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const amount = interaction.options.getInteger('amount') || 100;

        await channel.bulkDelete(amount)

        interaction.user.send({content: `**${amount}** messages were deleted from ${channel}.`}).then(msg => {
          setTimeout(() => {
            msg.delete()
          }, 15000);
        })
      } else {
        return await interaction.followUp({content: `You have no permission to run this command.`}).then(i => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 10000);
        })
      }
    },
  };