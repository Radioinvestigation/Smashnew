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
    .setName(`unmute`)
    .setDescription(`Un-mute a user in the server.`)
    .addUserOption((option) =>
      option
      .setName('user')
      .setDescription('The user to un-mute.')
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
        const user = interaction.options.getUser('user');
        
        const member = await client.guilds.cache.get(config.guildId).members.fetch(user.id)
        const muteRole = await client.guilds.cache.get(config.guildId).roles.cache.get('941354153777713185');

        if(member.roles.cache.has(muteRole.id)) {
            member.roles.remove(muteRole.id)
            user.send(`Your mute in **${interaction.guild.name}** has now expired.`)
            interaction.followUp({content: `**${user.username}#${user.discriminator}** was un-muted.`}).then(msg => {
                setTimeout(() => {
                  interaction.deleteReply()
                }, 15000);
              })
        }else {
            interaction.followUp({content: `**${user.username}#${user.discriminator}** is not muted.`}).then(msg => {
                setTimeout(() => {
                  interaction.deleteReply()
                }, 15000);
              })
        }
      } else {
        return await interaction.followUp({content: `You have no permission to run this command.`}).then(i => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 10000);
        })
      }
    },
  };