const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, InteractionCollector, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
require("moment-duration-format");
const cpuStat = require("cpu-stat");
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstats')
        .setDescription('View the stats for the bot'),
    async execute(interaction) {

        const duration = moment.duration(interaction.client.uptime).format(" D[d], H[h], m[m]");

        const Embed = new MessageEmbed()
        .setColor('BLACK')
        .setDescription(`**Server Count:** ${interaction.client.guilds.cache.size}\n**Users:** ${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\n**Ping:** ${Math.round(interaction.client.ws.ping)}ms\n**Uptime:** ${duration}`)

        await interaction.reply({ embeds: [Embed] })
    },
};