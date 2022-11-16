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
    .setName(`mute`)
    .setDescription(`Mute a user in the server.`)
    .addUserOption((option) =>
      option
      .setName('user')
      .setDescription('The user to mute.')
      .setRequired(true)
    )
    .addStringOption((option) => 
        option
        .setName('duration')
        .setDescription('The length of the mute.')
        .setRequired(true)
        .addChoice('1 minute', '60000')
        .addChoice('10 minutes', '600000')
        .addChoice('1 hour', '3600000')
        .addChoice('2 hours', '7200000')
        .addChoice('12 hours', '43200000')
        .addChoice('1 day', '86400000')
        .addChoice('1 week', '604800000')
        .addChoice('Permanent', '2208986640000')
    )
    .addStringOption((option) =>
    option
    .setName('reason')
    .setDescription('The reason for the mute.')
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
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason set.';

        let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)

        try {
            user.send(`You have been muted in **${interaction.guild.name}** by **${interaction.user.username}#${interaction.user.discriminator}** for **${reason}**.`)
        } catch (err) { 
            return console.log(err);
        }
        
        const member = await client.guilds.cache.get(config.guildId).members.fetch(user.id)
        const muteRole = await client.guilds.cache.get(config.guildId).roles.cache.get('941354153777713185');

        await member.roles.add(muteRole.id);
        setTimeout(() => {
            member.roles.remove(muteRole.id)
            user.send(`Your mute in **${interaction.guild.name}** has now expired.`)
        }, duration);

        interaction.followUp({content: `**${user.username}#${user.discriminator}** was muted.`}).then(msg => {
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