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
    .setName(`unban`)
    .setDescription(`Un-ban a user in the server.`)
    .addStringOption((option) =>
      option
      .setName('id')
      .setDescription('The user ID to un-ban.')
      .setRequired(true)
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
        const user = interaction.options.getString('id');
        await interaction.guild.members.unban(user);

        interaction.followUp({content: `User was unbanned.`}).then(msg => {
          setTimeout(() => {
            interaction.deleteReply()
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