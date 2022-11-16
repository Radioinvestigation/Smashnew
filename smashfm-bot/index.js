const fs = require('fs');
const chalk = require('chalk')
const { Client, Collection, MessageEmbed, Intents } = require('discord.js');
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Client({ intents: Object.keys(Discord.Intents.FLAGS).filter(x => ![].includes(x)).map(x => Discord.Intents.FLAGS[x]) });

client.cmds = new Collection();
var commandsData = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (var file of commandFiles) {
    var command = require(`./commands/${file}`);
    client.cmds.set(file.split(".")[0], command);
    commandsData.push(command.data.toJSON());
}

client.once('ready', async () => {
    console.log(`${chalk.greenBright(`${client.user.tag} is now connected to discord!`)}`);
    client.user.setActivity(`SmashFM!`, { type: 'LISTENING' });
    
    (async () => {
        try {
            console.log(`${chalk.yellowBright(`Loading application commands.`)}`);
            
            try {
                if(config.startup.devInstance == false){
                    client.guilds.cache.forEach((guild) => {
                        guild.commands.set(commandsData);
                    })
                    console.log(`${chalk.greenBright(`Loaded application commands - Global`)}`);
                }else if(config.startup.devInstance == true){
                    var devGuild = client.guilds.cache.get(config.developmentInstance.guildId)
                    devGuild.commands.set(commandsData);
                }
                console.log(`${chalk.greenBright(`Loaded application commands - Dev Mode`)}`);
            } catch (error){
                console.log(error)
                console.log(`${chalk.greenBright(`Ran into an error while registering application commands`)}`)
                return
            }

            
    
            
        } catch (error) {
            console.error(error);
        }
    })();
});



client.on('guildMemberAdd', async (member) => {
    if(member.guild.id !== '935966357256802384') {
        return
       }else {
        const membership = member.guild.roles.cache.get('936357724214689792');
        member.roles.add(membership);

        const WelcomeEmbed = new Discord.MessageEmbed()
        .setColor('BLACK')
        .setDescription(`${member} has just joined Smash. Be sure to welcome them!`)
        client.channels.cache.get('936688237936783400').send({embeds: [WelcomeEmbed]});
       }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    

    const command = client.cmds.get(interaction.commandName);

    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: `Seems I have ran into a error.`, ephemeral: true });
    }
});

try {
    if(config.startup.devInstance == false){
        client.login(config.productionInstace.token);  
    }else if(config.startup.devInstance == true){
    client.login(config.developmentInstance.token);   
    }
} catch (error){
    console.log(error)
    console.log(`${chalk.greenBright(`An error occured while trying to boot`)}`)
    
}