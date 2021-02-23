const Discord = require('discord.js');
const fs = require('fs');

async function getEmbed(msg){
    const customCmdEmbed = new Discord.MessageEmbed();
    let serverInfo = (JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8')))[msg.channel.guild.id];
    let commands = serverInfo["custom_commands"];
    if(commands.length == 0) return noCustomMsg(serverInfo);
    commands.forEach(cmd => {
        customCmdEmbed.addField(cmd.command, "???");
    });
    customCmdEmbed.setColor('#0099ff')
        .setDescription('Prefix: +');
    
    try{
        await msg.channel.send(customCmdEmbed);
    } catch(err){
        msg.channel.send("Can not send an embed message, make sure that I have permission to send embed messages");
    }
}

function noCustomMsg(server){
    let lang = server.lang;//Servers Language
    let responses = JSON.parse(fs.readFileSync('./langs/cmdresponses.json','utf-8'))["customcommands"];
    let response;
    responses.forEach(obj => {
        if(obj.lang === lang) response = obj.text;
    });
    return response;
}


module.exports = {
    getEmbed
}