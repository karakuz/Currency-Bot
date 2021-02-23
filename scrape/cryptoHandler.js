const Discord = require('discord.js');
const fs = require('fs');
//const getData = require('./getData');
const langHandler = require('C:\\Users\\user\\Desktop\\Currency Bot\\langs\\langHandler');

const names = Object.keys(JSON.parse(fs.readFileSync('./currencies/currency-data.json')).cryptos).sort();

const imgs={
    "BTC" : "https://cdn.pixabay.com/photo/2019/06/23/19/15/bitcoin-4294492_1280.png",
    "ETH" : "https://cdn.discordapp.com/attachments/337386922974511106/796901618678497330/etherium.png",
    "USDT" : "https://cdn.discordapp.com/attachments/337386922974511106/796903773510565898/8c980986-334a-4a4b-8e37-fe56d80d42d1.png",
    "LTC" : "https://media.discordapp.net/attachments/337386922974511106/798349523138772992/141-1410553_why-do-we-accept-only-litecoin-and-no.png",
    "BNB" : "https://cdn.discordapp.com/attachments/337386922974511106/796906264193400882/images_2.png",
    "XRP" : "https://res.cloudinary.com/geopayme/image/upload/f_auto,q_auto/v1585828404/ripple-coin.png",
    "ADA" : "https://cdn.discordapp.com/attachments/337386922974511106/796904789823717376/images_1.png",
    "DOT" : "https://pbs.twimg.com/profile_images/544448093542817792/iZ5VP00Z.png",
    "BCH" : "https://cdn.discordapp.com/attachments/337386922974511106/796909232796074044/Bitcoin-Cash.png",
    "XLM" : "https://media.discordapp.net/attachments/337386922974511106/798349530646183936/xlm-coin-300x300.png",
    "LINK" : "https://cdn.discordapp.com/attachments/337386922974511106/796909856282902558/shutterstock_1074298115.png",
    "WBTC" : "https://neironix.io/images/uploads/e5559e728f10ef76a763fc7a6f931074.png",
    "USDC" : "https://www.circle.com/hubfs/spot-icon-usdc.png",
    "BSV" : "https://cdn.discordapp.com/attachments/337386922974511106/796911726053425172/Bitcoin-SV.png",
    "EOS" : "https://toppng.com/uploads/preview/eos-cryptocurrency-11547076927xvpbegs2or.png",
    "XMR" : "https://cdn.discordapp.com/attachments/793053017879740426/800117985435582464/imageedit_28_2567295651.png"
}
const currArr = ['USD$','EUR€','GBP£','TRY₺','RUB₽','INR₹','JPY¥','CNRCNR'];

function cryptoEmbed(message,name){
    const crypto_Embed = new Discord.MessageEmbed();
    const currData = JSON.parse(fs.readFileSync('./currencies/currency-data.json'));
    const crypto = currData.cryptos[name.toUpperCase()];
    const serverData = JSON.parse(fs.readFileSync('./servers/servers.json'))[message.guild.id];
    const crypto_base = serverData.crypto_base;


    let price;
    if(crypto_base==="USD") price=crypto.current; 
    else{
        const currencies = currData.currencies; 
        const base_currency = serverData.base_currency;
        const unconvertedCrypto = parseFloat(crypto.current.replace('$','').replace(',',''));
        const exchangeRate = change(currencies,base_currency);
        const converted=(exchangeRate*unconvertedCrypto).toFixed(2);
        
        let i=0;
        for(let curr of currArr)
            if(curr.includes(crypto_base))
                i=currArr.indexOf(curr);
        const abbrv = currArr[i].split(crypto_base)[1];

        price=`${abbrv}${parseFloat(converted).numeral()}\n(${crypto.current})`;
    }  
    crypto_Embed.setColor('#0099ff')
        .setTitle(crypto.name)
        .setThumbnail(imgs[name.toUpperCase()])
        .addFields(
            {name: 'Current', value:price, inline: true},
            {name: 'Hourly', value:crypto.hourly, inline: true},
            {name: 'Daily', value:crypto.daily, inline: true},
            {name: 'Weekly', value:crypto.weekly, inline: true},
            {name: 'Market Cap', value:crypto.market_cap, inline: true}
        )
    return crypto_Embed;
}

async function getAllNames(client,message,pageNumber){
    let cryptosAllEmbed;
    if(pageNumber==undefined){
        cryptosAllEmbed = getEmbed(1);
        await message.channel.send(cryptosAllEmbed);
        react(client,message);
        return;
    }
    else
        cryptosAllEmbed=getEmbed(pageNumber);
    return cryptosAllEmbed;
}

function getEmbed(pageNumber){
    let cryptosAllEmbed;
    if(pageNumber==1){
        cryptosAllEmbed = groups(0);
        cryptosAllEmbed.setFooter('Page 1/5');
    }
    else if(pageNumber==2){
        cryptosAllEmbed = groups(findIndex(2));
        cryptosAllEmbed.setFooter('Page 2/5');
    }
    else if(pageNumber==3){
        cryptosAllEmbed = groups(findIndex(3));
        cryptosAllEmbed.setFooter('Page 3/5');
    }
    else if(pageNumber==4){
        cryptosAllEmbed = groups(findIndex(4));
        cryptosAllEmbed.setFooter('Page 4/5');
    }
    else if(pageNumber==5){
        cryptosAllEmbed = groups(findIndex(5));
        cryptosAllEmbed.setFooter('Page 5/5');
    }
    return cryptosAllEmbed;
}

function groups(index){
    const cryptosAllEmbed = new Discord.MessageEmbed();    
    cryptosAllEmbed.setTitle('All Cryptos')
        .setDescription('Type \'+\' front to run.\nEx: `+btc`')
        .setColor('#0099ff');

    var char = names[index][0], arr=[names[index]], charCount=0;
    for(let i=index+1; charCount<6 && i<names.length;i++){
        const firstChar = names[i][0];
        if(char == firstChar)
            arr.push(names[i])
        else{
            cryptosAllEmbed.addField(char,setGroups(arr),true);
            arr=[names[i]];
            char=firstChar;
            charCount++;
        }
    }
    console.log(index);
    console.log(arr[0]);
    if(index==97 && arr[0][0]=="Z") cryptosAllEmbed.addField(char,setGroups(arr),true);
    return cryptosAllEmbed;
}

function findIndex(pageNumber){
    var char = names[0][0],nextChar=0,numOfCrpyto=0;
    for(let i=1; nextChar<6*(pageNumber-1);i++){
        const firstChar = names[i][0];
        if(char!=firstChar){
            char=firstChar;
            nextChar++;
        }
        numOfCrpyto++;
    }
    return numOfCrpyto;
}

function setGroups(group){
    let res="";
    for(let name of group)
        res = res + name + "\n";
    return res;
}

const wait = (time) => new Promise(resolve => {setTimeout(resolve,time)});
async function react(client,msg){
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

function changeBase(message,args){
    const servers = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'));
    const currencies = Object.keys(JSON.parse(fs.readFileSync('./currencies/currency-data.json', 'utf-8')).currencies);
    console.log(args[2]);
    if(args[2]==undefined){
        message.channel.send(response(["cryptobase_none"],message,""));
        return;
    } 
    else if(currencies.indexOf(args[2].toUpperCase())==-1){
        message.channel.send(response(["cryptobase_err"],message,args[2].toUpperCase()));
        return;
    }
    else if(args[2].toUpperCase()===servers[message.channel.guild.id].crypto_base){
        message.channel.send(response(["cryptobase_err2"],message,args[2].toUpperCase()+'!'));
        return;
    }
    else{
        servers[message.channel.guild.id].crypto_base = args[2].toUpperCase();
        fs.writeFileSync('./servers/servers.json',JSON.stringify(servers,null,'\t'));
        message.channel.send(langHandler.response(["cryptobase_res"],message,args[2].toUpperCase()));
    }
}

function change(currencies,base){
    let i;
    for(let curr of currencies[base])
        if(curr.name=="USD")
            i=currencies[base].indexOf(curr);
    console.log(currencies[base][i].current);
    return parseFloat(currencies[base][i].current)
}

function response(args,msg,param){
    let lang = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id].lang;
    let responses = JSON.parse(fs.readFileSync('./langs/cmdresponses.json','utf-8'))[args[0]];
    let response;
    responses.forEach(obj => {
        if(obj.lang === lang) response = obj.text;
    });
    if(param != "") return response.replace("$", param);
    else return response;
}

module.exports = {
    cryptoEmbed,
    getAllNames,
    changeBase
}

