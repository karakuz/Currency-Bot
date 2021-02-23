const Discord = require('discord.js');
const fs = require('fs');

const langHandler = require('../../langs/langHandler');

async function getEmbed(msg,isInteractive){
    const currEmbed = new Discord.MessageEmbed();
    let serverInfo = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id];//Server's Info
    let currBase = serverInfo.base_currency;
    
    currEmbed
        .setColor('#0099ff')
        
    try{
        if(!isInteractive)await msg.channel.send(setFields(currEmbed,serverInfo,currBase));
        else return setFields(currEmbed,serverInfo,currBase);
    } catch(err){
        msg.channel.send(langHandler.response(["embed_err"],msg,""));
    } 
}

function setFields(embed,serverInfo,currBase){
    var symbols = ['$','€','£','₺','¥','₽','₹'];
    var curr = ['USD','EUR','GBP','TRY/TL','JPY/YEN','RUB','INR','CNY'];

    var index;
    curr.forEach((i) =>{
        i.split('/').forEach((x) => { if(x == currBase) index=curr.indexOf(i);})
    });
    symbols.splice(index,1);
    curr.splice(index,1);

    let rand1 = Math.floor(Math.random()*curr.length);
    let rand2 = Math.floor(Math.random()*curr.length);
    while(rand1 == rand2){ rand2 = Math.floor(Math.random()*curr.length) }
    let rand3 = Math.floor(Math.random()*(curr.length-1));
    let rand4 = Math.floor(Math.random()*(curr.length-1));
    while(rand3 == rand4){ rand4 = Math.floor(Math.random()*(curr.length-1)) }
    if(serverInfo.lang === "english"){
        let currcmds = ["dollar","euro","pound","lira","yen","ruble","rupee","yuan"];
        currcmds.splice(index,1);
        embed
            embed
            .setTitle('Currency Commands')
            .setDescription(`Prefix + \nBase Currency: ${currBase}`)
            .addFields(
                { "name": "Currencies", "value": "dollar\neuro\npound/sterling\nlira\nruble\nrupi\nyen\nyuan", inline:true },
                { "name": "Symbol", "value" : "$\n€\n£\n₺\n₽\n₹\n¥", inline:true },
                { "name": "Abbreviation", "value" : "USD\nEUR\nGBP\nTRY/TL\nRUB\nINR\nJPY/YEN\nCNR", inline:true },
                { "name": "Calculation (without prefix)", "value": "[number][symbol] OR [number][abbrv]" },
                { "name": "Example Usage", "value" : `\`+${curr[rand1].split('/')[0]}\` --> Current ${curr[rand1].split('/')[0]}/${currBase} value
                                                      \`+${currcmds[rand2]}\` --> Current ${curr[rand2].split('/')[0]}/${currBase} value
                                                      \`150${symbols[rand3]}\` --> ${currBase} of 150${curr[rand3]} 
                                                      \`150${curr[rand4]}\` --> ${currBase} of 150${curr[rand4]} 
                                                      \nNote: No symbol for CNY` }
            )
    }
    else{//lang === "turkish"
        let currcmds = ["dolar","euro","pound","lira","yen","ruble","rupi","yuan"];
        currcmds.splice(index,1);
            embed
            .setTitle('Kur komutları')
                .setDescription(`Prefix + \nTanımlı kur: ${currBase}`)
                .addFields(
                    { "name": "Kurlar", "value": "dolar\neuro\npound/sterlin\nlira\nruble\nrupee\nyen\nyuan", inline:true },
                    { "name": "Sembol", "value" : "$\n€\n£\n₺\n₽\n₹\n¥", inline:true },
                    { "name": "Kısaltma", "value" : "USD\nEUR\nGBP\nTRY/TL\nJRUB\nINR\nJPY/YEN\nCNR", inline:true },
                    { "name": "Hesaplama (prefixsiz)", "value": "[sayı][sembol] veya [sayı][kısaltma]\n\n" },
                    { "name": "Örnek Kullanım", "value" : `\`+${curr[rand1].split('/')[0]}\` --> Güncel ${curr[rand1].split('/')[0]}/${currBase}
                                                        \`+${currcmds[rand2]}\` --> Güncel ${curr[rand2].split('/')[0]}/${currBase}
                                                        \`150${symbols[rand3]}\` --> 150${curr[rand3]}'ın ${currBase} karşılığı
                                                        \`150${curr[rand4]}\` --> 150${curr[rand4]}'ın ${currBase} karşılığı
                                                        \nNot: CNY için tanımlı sembol yok` }
                )
        if(serverInfo.base_currency === "TRY"){
                embed.addFields(
                    { "name": "TL özel komutlar:", "value": "+dolarrekor --> dolar tüm zamanlar rekor\n +eurorekor --> euro tüm zamanlar rekor" },
                )            
        }
    }
    return embed;
}

module.exports = {
    getEmbed
}