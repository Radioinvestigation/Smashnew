const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed,
    InteractionCollector,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const fetch = require('node-fetch')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, createReadStream } = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops playing FlowRadio in your VC'),
    async execute(interaction) {
        if(interaction.member.voice.channelId && interaction.guild.me.voice.channelId) {
            await interaction.guild.me.voice?.disconnect(); 
            await interaction.reply({content: `Thanks for listening, see ya soon!`})
        }else {
            if(interaction.member.voice.channelId) {
                await interaction.reply({content: `The bot seems to already be in your VC`, ephemeral: true})
            }
            else {
            await interaction.reply({content: `You are not connected to a VC`, ephemeral: true})
            }
        }
    },
};