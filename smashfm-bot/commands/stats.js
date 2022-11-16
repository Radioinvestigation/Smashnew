const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, InteractionCollector } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Check out the current statistics of the radio'),
    async execute(interaction) {

        const getData = await fetch('https://azuracast1.itssmash.net/api/nowplaying/2');
        const data = await getData.json();

        console.log(data)

        var currentdj
        var dj = `${data.live.streamer_name}`
        if (dj === ""){
            currentdj = "AutoDJ"
        }else{

        currentdj = `${data.live.streamer_name}`

    }
        const Embed = new MessageEmbed()
        .setColor('BLACK') 
        .setThumbnail(data.now_playing.song.art)
        .addField('Now Playing', `${data.now_playing.song.title} by ${data.now_playing.song.artist}`)
        .addField('Listeners', `${data.listeners.total}`, true)
        .addField('Current DJ:', `${currentdj}`)
        .setColor(`BLACK`)

        await interaction.reply({ embeds: [Embed] })
    },
};