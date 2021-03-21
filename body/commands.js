const getData = require('../scrape/getData');
const helpEmbed = require('./embeds/helpEmbed');
const customCmdEmbed = require('./embeds/customCmdEmbed');
const calculator = require('./calculator');
const functions = require('./functions');
const langs = require('../langs/langHandler');
const currHandler = require('../currencies/currencyHandler');
const currCommands = require('./embeds/currEmbed');
const customHandler = require('../servers/customHandler');
const cryptoHandler = require('../scrape/cryptoHandler');
const cryptosHelp = require('../body/embeds/cryptocurrencies');
const satelliteHandler = require('../currencies/satelliteHandler');
const profileHandler = require('../investment/profileHandler');
const investmentEmbed = require('./embeds/investment');

var onSince = functions.now();

const abbreviations = ["USD","EUR","GBP","TRY","TL","JPY","RUB","INR","CNR"];
module.exports.readCommand = async function(message,prefix,client){
    //console.log(`Author: ${message.author.username}, Message:${message.content}`);
    if(/\d/.test(message.content) && !message.content.startsWith('.') && !message.author.bot && !message.content.startsWith(prefix))
        calculator.calculate(message);
    if(!message.content.startsWith(prefix) || message.author.bot || message.channel.type == 'dm')return;

    let args = message.content.substring(prefix.length).split(" ");
    if((abbreviations.indexOf((args[0].toUpperCase()))!=-1 && args[1] === undefined) || args[0] === "auth"){
        console.log("nothing");
    }
    else{
        (args[0] == "help") ? args[0] = "help" : (args[0] == "pound") ? args[0] = "pound" : args = langs.getCommand(args, message);
    }
    console.log("In commands: " + args);
    if(message.author.id != "225615132011659266" && args != "not in commands.json"){
        console.log(`Command: ${message.content}, by: ${message.author.username}, in(Server): ${message.guild.name}`);
        client.channels.cache.get('792987934089281578').send(functions.logger(message));
    }
    switch(args[0].toLowerCase()){
        case 'status':
            message.channel.send(langs.response(args,message,onSince));
        break;

        case 'help':
            helpEmbed.getEmbed(message,client);
            //message.delete({timeout:5000})
        break;

        case 'languages':
            message.channel.send(langs.languages(args,message));
        break;

        case 'setlanguage':
            langs.changeLanguage(args,message);
        break;

        case 'setbase':
            message.channel.send(currHandler.setBase(args,message));
        break;

        case 'currencies':
            currCommands.getEmbed(message,false);
        break;
        /*
        case 'cryptos':
            if(args[1] === undefined) cryptosHelp.getEmbed(message,false);
            else if(args[1] === "all" || args[1] === "hepsi") cryptoHandler.getAllNames(client,message);
            else if(args[1] === "base" || args[1] === "kur") cryptoHandler.changeBase(message,args);
        break;

        case 'investment':
            message.channel.send(investmentEmbed.getEmbed(message));
        break;
        
        case 'satellites':
            if(args[1] === 'activate' || args[1] === 'aktive')
                satelliteHandler.satelliteActivate(message);
        break;

        case 'profile':
            profileHandler.main(message);
        break;

        case 'buy':
        case 'sell':
            profileHandler.invest(message,args);
        break;

        case 'rankings':
            message.channel.send(await profileHandler.rankings(message));
        break;
        
        /*
        case 'customcommands':
            sendMessage(customCmdEmbed.getEmbed(message), false);
        break;

        case 'addcustom':
            customHandler.addCustomCmd(message);
        break;

        case 'removecustom':
            customHandler.removeCustomCmd(message,args);
        break;
*/
       
        case 'dollar':
        case 'usd':
            getData.getData(message, "USD","print").then(res => message.channel.send(res));
        break;

        case 'dollarrecord':
            getData.getData(message, "USDrecord","print").then(res => message.channel.send(res));
        break;

        case 'euro':
        case 'eur':
            getData.getData(message, "EUR","print").then(res => message.channel.send(res));
        break;

        case 'eurorecord':
            getData.getData(message, "EURrecord","print").then(res => message.channel.send(res));
        break;

        case 'sterling':
        case 'pound':
        case 'gbp':
            getData.getData(message, "GBP","print").then(res => message.channel.send(res));
        break;

        case 'yen':
        case 'jpy':
            getData.getData(message, "JPY","print").then(res => message.channel.send(res));
        break;

        case 'ruble':
        case 'rub':
            getData.getData(message, "RUB","print").then(res => message.channel.send(res));
        break;

        case 'rupee':
        case 'inr':
            getData.getData(message, "INR","print").then(res => message.channel.send(res));
        break;

        case 'yuan':
        case 'cny':
            getData.getData(message, "CNY","print").then(res => message.channel.send(res));
        break;

        case 'lira':
        case 'try':
        case 'tl':
            getData.getData(message, "TRY","print").then(res => message.channel.send(res));
        break;
        
        case 'btc':
        case 'eth':
        case 'usdt':
        case 'ltc':
        case 'bnb':
        case 'xrp':
        case 'ada':
        case 'dot':
        case 'bch':
        case 'xlm':
        case 'link':
        case 'wbtc':
        case 'usdc':
        case 'bsv':
        case 'eos':
        case 'xmr':
        case 'uni':
        case 'aave':
        case 'xtz':
        case 'trx':
        case 'theta':
        case 'xem':
        case 'snx':
        case 'cro':
        case 'atom':
        case 'vet':
        case 'neo':
        case 'mkr':
        case 'dai':
        case 'leo':
        case 'dash':
        case 'miota':
        case 'doge':
        case 'busd':
        case 'cel':
        case 'zec':
        case 'fil':
        case 'yfi':
        case 'ht':
        case 'sol':
        case 'avax':
        case 'rev':
        case 'comp':
        case 'ftt':
        case 'sushi':
        case 'etc':
        case 'ksm':
        case 'zil':
        case 'waves':
        case 'dcr':
        case 'algo':
        case 'grt':
        case 'egld':
        case 'hedg':
        case 'uma':
        case 'ren':
        case 'ont':
        case 'omg':
        case 'near':
        case 'lrc':
        case 'renbtc':
        case 'nano':
        case 'zrx':
        case 'tusd':
        case 'hbar':
        case 'bat':
        case 'luna':
        case 'icx':
        case 'rsr':
        case 'okb':
        case 'dgb':
        case 'stx':
        case 'nexo':
        case 'btt':
        case 'iost':
        case 'crv':
        case 'rune':
        case 'qtum':
        case 'zen':
        case 'ewt':
        case 'chsb':
        case 'husd':
        case 'celo':
        case 'btcb':
        case 'ocean':
        case 'vgx':
        case 'knc':
        case 'pax':
        case 'qnt':
        case 'rep':
        case 'btg':
        case 'band':
        case 'sc':
        case 'nxm':
        case 'xvg':
        case 'enj':
        case 'abbc':
        case 'snt':
        case 'ust':
        case 'ampl':
            message.channel.send(cryptoHandler.cryptoEmbed(message,args[0]));
        break;

        case 'stats':
            if(message.author.id == "225615132011659266" || message.author.id == "166552619790237697" || message.author.id == "290153479622623233")
                dev_embed(message,client);
        break;
    }
    switch(args[1]){
        case 'custom':
            console.log("Nothing");
        break;
    }
}

function dev_embed(message,client){
    const Discord = require('discord.js');
    const fs = require('fs');
    let servers = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'));
    let stats = JSON.parse(fs.readFileSync('./satellite_stats.json', 'utf-8'));

    const dev_embed = new Discord.MessageEmbed();
    let totalMembers = 0;

    const arr=client.guilds.cache.keyArray();
    console.log("Missing servers in json:");
    arr.forEach(serverID => {
        if(Object.keys(servers).indexOf(serverID)==-1)
            console.log(serverID);
    });
    console.log("Undeleted servers in json:");
    Object.keys(servers).forEach( serverId => {
        if(arr.indexOf(serverId)==-1) console.log(serverId);
        if(client.guilds.cache.get(serverId)==undefined) console.log(client.guilds.cache.get(serverId));
        if(client.guilds.cache.get(serverId)!=undefined && client.guilds.cache.get(serverId).memberCount!=undefined) totalMembers += client.guilds.cache.get(serverId).memberCount;
    });
    dev_embed.setColor('#0099ff')
        .setTitle('Currency Bot Stats')
        .addFields(
            {name: "Server Count", value: `${client.guilds.cache.size}`, inline:true},
            {name: `Total users in servers`, value: `${totalMembers}`, inline:true},
            {name: `Server Count of satellites`, value: `BTC: ${stats["BTC"]}\nETH: ${stats["ETH"]}\nLTC: ${stats["LTC"]}\n`}
        );
    message.channel.send(dev_embed);
}
