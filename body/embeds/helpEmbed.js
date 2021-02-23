const Discord = require('discord.js');
const fs = require('fs');

const langHandler = require('../../langs/langHandler');
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

async function getEmbed(msg,client,isInteractive){
    const helpEmbed = new Discord.MessageEmbed();
    let serverInfo = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id]; 
    //let lang = serverInfo[msg.channel.guild.id].lang;
    let fields = JSON.parse(fs.readFileSync('./langs/helpEmbed.json', 'utf-8'))[serverInfo.lang];
    fields.forEach(field => {
        helpEmbed.addField(field.name, field.value);
    });    
    helpEmbed.setColor('#0099ff')
    .setDescription('Prefix: +')

    if(serverInfo.lang === "english"){
        helpEmbed
            .setTitle('Currency Bot Commands')
            .addField("Need more help?", "Contact us through our [Discord Server](https://discord.gg/w85kDjvd4v)")
            .setFooter('Page 1/4');
    }
    else{// lang === turkish
        helpEmbed
            .setTitle('Currency Bot Komutları')
            .addField("Yardıma mı ihtiyacınız var?", "Bizimle [Discord Sunucumuzda](https://discord.gg/w85kDjvd4v) iletişime geçin")
            .setFooter('Sayfa 1/4');
    }
    
    try{
        if(!isInteractive){
            await msg.channel.send(helpEmbed);
            helpReact(msg,client);
        } 
        else return helpEmbed;
    } catch(err){
        msg.channel.send(langHandler.response(["embed_err"],msg,""));
    }
}

async function helpReact(msg,client){
    const channelID = msg.channel.id;
    const embedID = msg.channel.lastMessageID;

    var message = client.channels.cache.get(channelID).messages.cache.get(embedID);
    await message.react("⬅️");
    await wait(1000);
    await message.react("🗑️");
    await wait(1000);
    await message.react("➡️");
    await wait(1000);
}

module.exports = {
    getEmbed    
}    
