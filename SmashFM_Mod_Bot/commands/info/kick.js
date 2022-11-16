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
    .setName(`kick`)
    .setDescription(`Kick a user from the server.`)
    .addUserOption((option) =>
      option
      .setName('user')
      .setDescription('The user to kick.')
      .setRequired(true)
    )
    .addStringOption((option) =>
      option
      .setName('reason')
      .setDescription('The reason for the kick.')
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
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason set.';

        try {
            user.send(`You have been kicked from **${interaction.guild.name}** by **${interaction.user.username}#${interaction.user.discriminator}** for **${reason}**.`)
        } catch (err) { 
            return console.log(err);
        }
        
        const member = await client.guilds.cache.get(config.guildId).members.fetch(user.id)
        await member.kick({reason: reason})

        interaction.followUp({content: `**${user.username}#${user.discriminator}** was kicked from **${interaction.guild.name}**.`}).then(msg => {
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