const { SlashCommandBuilder } = require('@discordjs/builders');
const { client, MessageEmbed, InteractionCollector, Collection, Intents } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('See how many servers the bots in!'),
    async execute(interaction) {

        const Embed = new MessageEmbed()
        .setColor('BLACK')
        .addField('Server Count', `${interaction.client.guilds.cache.size}`)

        await interaction.reply({ embeds: [Embed] })
    },
};