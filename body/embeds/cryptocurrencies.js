const Discord = require('discord.js');
const fs = require('fs');

const langHandler = require('../../langs/langHandler');
const currArr = ['USD$','EUR€','GBP£','TRY₺','RUB₽','INR₹','JPY¥','CNRCNR'];

async function getEmbed(msg,isInteractive){
    const helpEmbed = new Discord.MessageEmbed();
    let serverInfo = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id]; 
    const crypto_base = serverInfo.crypto_base;

    let i=0;
    for(let curr of currArr)
        if(curr.includes(crypto_base))
            i=currArr.indexOf(curr);
    const abbrv = currArr[i].split(crypto_base)[1];

    if(serverInfo.lang == "english"){
        helpEmbed.setTitle('Cryptocurrency commands')
        helpEmbed.setColor('#0099ff')
        .setDescription('Prefix: +')
        .addField('[crypto]','Statistics of [crypto]. Check `+cryptos all` for all\nEx: `+btc`')
        .addField('cryptos all','All cryptos. \nYou can even invite satellite bots to check current crypto values!')
        .addField('cryptos base [currency]','Changes what crypto prices\' shown in.\nCryptos will be shown in #. \nType `+cryptos base [currency]` to change'.replace('#',`${abbrv}(${crypto_base})`))
        .addField('What is satellites?','Satellite bots that watches cryptocurrencies!\nCheck the [image](https://pasteboard.co/JHVGbTN.png)\nIf you\'ve added any of these,\ntype `+satellites activate` to activate')
        .addField('satellites activate','Activate added satellite bots')
        .addField('Satellite Links:',
            '[BTC](https://discord.com/oauth2/authorize?client_id=793803431348797450&scope=bot&permissions=67108864),' + 
            '[ETH](https://discord.com/oauth2/authorize?client_id=793866510996996127&scope=bot&permissions=67108864),' + 
            '[LTC](https://discord.com/oauth2/authorize?client_id=793868823257939988&scope=bot&permissions=67108864),');
    }
    else if(serverInfo.lang == "turkish"){
        helpEmbed.setTitle('Krito Komutları')
        helpEmbed.setColor('#0099ff')
        .setDescription('Prefix: +')
        .addField('[kripto]','[kripto] istatistikleri. Bütün kripto adları için `+kriptolar hepsi`\nÖrn: `+btc`')
        .addField('kriptolar hepsi','Bütün kriptolar. \nCanlı olarak kripto değerlerini izlemek için uydu botlarını ekleyin!')
        .addField('kriptolar kur [kuradı]','Kriptoların gösterilen para birimini değiştirir. Kriptolar şu an # olarak gösterilecek. \nDeğiştirmek için `+kriptolar kur [kuradı]`'.replace('#',`${abbrv}(${crypto_base})`))
        .addField('Uydu botları nelerdir?','Canlı değer izleyen uydu botları!\nFotoğraf: [image](https://pasteboard.co/JHVGbTN.png)\nEğer herhangi birini eklediyseniz, `+uydular aktive` yazarak aktive edin')
        .addField('uydular aktive','Uydu botları aktive eder')
        .addField('Uydu Linkleri:',
            '[BTC](https://discord.com/oauth2/authorize?client_id=793803431348797450&scope=bot&permissions=67108864),' + 
            '[ETH](https://discord.com/oauth2/authorize?client_id=793866510996996127&scope=bot&permissions=67108864),' + 
            '[LTC](https://discord.com/oauth2/authorize?client_id=793868823257939988&scope=bot&permissions=67108864),');
    }

    try{
        if(!isInteractive) await msg.channel.send(helpEmbed);
        else return helpEmbed;
    } catch(err){
        msg.channel.send(langHandler.response(["embed_err"],msg,""));
    }
}

module.exports = {
    getEmbed
}