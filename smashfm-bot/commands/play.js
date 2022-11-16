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
        .setName('play')
        .setDescription('Plays FlowRadio in your VC'),
    async execute(interaction) {
        if(!interaction.member.voice.channelId) {
            return interaction.reply({content: `You are not connected to a voice channel.`, ephemeral: true})
        }
        connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
        });
        
        
        let resource = createAudioResource(('https://azuracast1.itssmash.net/radio/8010/bot.mp3'), { inlineVolume: true });
        resource.volume.setVolume(1);
        
        const player = createAudioPlayer();

        connection.subscribe(player);
        player.play(resource)

        await interaction.reply({ content: `Now Playing: **SmashFM** in your VC.`});
    },
};