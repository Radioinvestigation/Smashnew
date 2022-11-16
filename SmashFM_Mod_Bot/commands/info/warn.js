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
  const db = require("quick.db");


  const fs = require('fs');
  const globPromise = promisify(glob);
  const config = require(`${process.cwd()}/config.json`);
  
  module.exports = {
    ...new SlashCommandBuilder()
    .setName(`warn`)
    .setDescription(`Warn a user in the server.`)
    .addUserOption((option) =>
      option
      .setName('user')
      .setDescription('The user to warn.')
      .setRequired(true)
    )
    .addStringOption((option) =>
    option
    .setName('reason')
    .setDescription('The reason for the warn.')
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

        let warnings = db.get(`warnings_${interaction.guild.id}_${user.id}`)

        if(warnings === null) {
            db.set(`warnings_${interaction.guild.id}_${user.id}`, 1)
            user.send(`You have been warned in **${interaction.guild.name}** for **${reason}**.`)
        } else if(warnings !== null) {
            db.add(`warnings_${interaction.guild.id}_${user.id}`, 1)
           user.send(`You have been warned in **${interaction.guild.name}** for **${reason}**.`)
        }

        interaction.followUp({content: `**${user.username}#${user.discriminator}** was warned.`}).then(msg => {
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