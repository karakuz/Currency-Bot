const Discord = require('discord.js');
const fs = require('fs');

function getEmbed(message){
    const embed = new Discord.MessageEmbed();
    const serverInfo = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[message.channel.guild.id]; 

    embed.setColor('#0099ff')
        .setTitle('Fake Investment Commands')
        .setDescription(`Prefix + \nBase Currency: ${serverInfo.base_currency}`)
        .addFields(
            {"name": "Info", "value" : "Each user starts with `1.000.000` cash with assigned base currency\nCommands shown below are just examples.\nNumbers and crypto names can be changed\nCheck `+cryptos all` for all crypto names\n"},
            {"name": "+profile", "value" : "Creates a profile"},
            {"name": "Buy Commands", "value" : `\`+buy all btc\` => buys \`BTC\` with all of your cash\n\`+buy half btc\` => buys \`BTC\` with half of your cash\n\`+buy 1 btc\` => buys 1 \`BTC\`\n\`+buy btc w/100000\` buys \`BTC\` with \`100000\` cash`},
            {"name": "Sell Commands", "value" : `\`+sell all btc\` => sells all \`BTC\` you have\n\`+sell half btc\` => sells half of your \`BTC\`\n\`+sell 1 btc\` => sells 1 \`BTC\`\n`},
            {"name": "+rankings", "value" : "Shows the server's player rankings based on their profits"}
        )
        .setFooter(`Note: Investments are reset in 15 days after creating the first profile in a server`);
    
    return embed;
}

module.exports = {
    getEmbed
}