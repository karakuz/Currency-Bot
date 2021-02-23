const fs = require("fs");
const Discord = require('discord.js');
const getData = require('C:\\Users\\user\\Desktop\\Currency Bot\\scrape\\getData');

async function main(message){
    const serverID = message.guild.id;
    const base = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\servers\\servers.json'))[serverID].base_currency;
    const user_data = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json'));
    
    if(Object.keys(user_data).indexOf(serverID)==-1 || user_data[serverID][message.author.id] == undefined)
        createProfile(message,user_data,serverID,message.author.id,base);
    else message.channel.send(await profileEmbed(message,user_data[serverID][message.author.id],base));
}

async function createProfile(message,data,serverID, userID, base){
    //const currencies = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\currencies\\currency-data.json')).currencies;
    let amount = 1000000;
    //if(base!="USD") amount = ((change(currencies,base))*amount).toFixed(2);
    if(data[serverID]==undefined) data[serverID] = {"time_created" : String(new Date())};
    data[serverID][userID] = {"start" : `${String(amount)}`, "cash" : `${String(amount)}`, "investments" : {}};

    fs.writeFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json',JSON.stringify(data,null,'\t'))
    message.channel.send(await profileEmbed(message,data[serverID][userID],base));
}

async function profileEmbed(message,user,base){
    const embed = new Discord.MessageEmbed();
    let cash = parseFloat((parseFloat(user.cash)).toFixed(3)).numeral();
    const netWorth = parseFloat((await netWorth_(user,base,message)).toFixed(3));
    const profit = parseFloat((netWorth-parseFloat(user.start)).toFixed(3));
    let change = ((netWorth-parseFloat(user.start))/parseFloat(user.start)).toFixed(3);
    embed.setColor('#0099ff')
        .setAuthor(`${message.author.username}'s Profile`, `${message.author.displayAvatarURL()}`, ' ')
        .addField(":moneybag: Cash" , `\`${cash} ${base}\``)
        .setFooter(`Net Worth: ${netWorth.numeral()} ${base}\nProfit: ${profit.numeral()} ${base} (%${change})`);

    if(Object.keys(user.investments).length == 0) embed.addField('Investments','None');
    else{
        const emojis = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\emojis.json'))
        for(let crypto_name of Object.keys(user.investments)) embed.addField(`•${crypto_name}`,`<:${crypto_name.toLowerCase()}:${emojis[crypto_name.toLowerCase()]}> \`${parseFloat(user.investments[crypto_name]).toFixed(3)}\``,true);
    }
    return embed;
}

async function netWorth_(user,base,message){
    const currency_data = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\currencies\\currency-data.json'));
    const crypto_data = currency_data.cryptos;
    const userCash = parseFloat(user.cash);

    let sum=0;
    if(base!="USD"){
        for(let crypto_name of Object.keys(user.investments)){
            const crypto_price_in_USD = parseFloat(crypto_data[crypto_name].current.substring(1).replace(',',''))*parseFloat(user.investments[crypto_name]);
            const inBase = crypto_price_in_USD*parseFloat(await getData.getData(message,"USD","eval"));
            sum+=inBase;
        }
    }
    else{
        for(let crypto_name of Object.keys(user.investments)){
            const crypto_price_in_USD = parseFloat(crypto_data[crypto_name].current.substring(1).replace(',',''))*parseFloat(user.investments[crypto_name]);
            sum+=crypto_price_in_USD;
        }
    }
    return sum+userCash;
}

async function invest(message,args){
    const serverID = message.guild.id;
    const userID = message.author.id;
    const user_data = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json'));
    const base = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\servers\\servers.json'))[serverID].base_currency;
    const cryptos = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\currencies\\currency-data.json')).cryptos;
    const crypto_names = Object.keys(cryptos);

    if(Object.keys(user_data).indexOf(serverID)==-1 || user_data[serverID][userID] == undefined) message.channel.send("You dont have a profile. Type `+profile` to create a one");
    else if(args[1]!=undefined && args[2]!=undefined && args[0]=="buy") await buyOrSell("buy",args,message,serverID,userID,user_data,base,cryptos,crypto_names);
    else if(args[1]!=undefined && args[2]!=undefined && args[0]=="sell") await buyOrSell("sell",args,message,serverID,userID,user_data,base,cryptos,crypto_names);
}

async function buyOrSell(which,args,message,serverID,userID,user_data,base,cryptos,crypto_names){
    const userCash = parseFloat(user_data[serverID][userID].cash);
    args[1]=args[1].toUpperCase();
    args[2]=args[2].toUpperCase();
    //+buy/sell 1 BTC
    if(!isNaN(parseFloat(args[1])) && crypto_names.indexOf(args[2])!=-1){
        const user_crypto_amount = (which=="sell") ? findCryptoAmount(user_data[serverID][userID],args[2]) : undefined;
        const nonConverted = parseFloat(cryptos[args[2]].current.substring(1).replace(',',''))*args[1];
        const price = (base!="USD") ? nonConverted*parseFloat(await getData.getData(message,"USD","eval")) : nonConverted;
        if(which=="buy" && price>userCash) message.channel.send(`You dont have enough cash to buy. You have: \`${parseFloat(userCash.toFixed(3)).numeral()} ${base}\`. Required \`${parseFloat(price.toFixed(3)).numeral()} ${base}\``)
        else if(which=="sell" && parseFloat(args[1])>user_crypto_amount) message.channel.send(`You have \`${user_crypto_amount} ${args[2]}\`. Can not sell \`${args[1]} ${args[2]}\``);
        else{
            save(which,args[2],user_data,serverID,userID,userCash,price,parseFloat(args[1]));
            if(which=="buy") message.channel.send(`You bought \`${args[1]} ${args[2]}\` worth \`${price} ${base}\`\nRemaining cash: \`${(userCash-price).numeral()} ${base}\``);
            else message.channel.send(`You sold \`${args[1]} ${args[2]}\`\nCash: \`${(userCash+price).numeral()} ${base}\``);
        }
    }//+buy/sell all btc
    else if((args[1] == "ALL" || args[1] == "HALF") && crypto_names.indexOf(args[2])!=-1){
        let user_crypto_amount = (which=="sell") ? findCryptoAmount(user_data[serverID][userID],args[2]) : undefined;
        const nonConverted = parseFloat(cryptos[args[2]].current.substring(1).replace(',',''));
        const convCryptoPrice = (base!="USD")? nonConverted*(parseFloat(await getData.getData(message,"USD","eval"))) : nonConverted;

        if(which=="sell" && user_crypto_amount==0) {message.channel.send(`You dont have any \`${args[2]}\``); return;}
        else if(which=="buy" && userCash==0) {message.channel.send(`You have \`${userCash}\` cash`); return;}
        else if(which=="buy"){
            const eqOf = (args[1] == "ALL") ? userCash/convCryptoPrice : (userCash/convCryptoPrice)/2;
            const price = eqOf*convCryptoPrice;
            save(which,args[2],user_data,serverID,userID,userCash,price,eqOf);
            message.channel.send(`You have bought \`${eqOf} ${args[2]}\` with ${args[1].toLowerCase()} of your money\nRemaining cash: \`${parseFloat((userCash-price).toFixed(3)).numeral()} ${base}\``);
        }
        else{
            user_crypto_amount = (args[1] == "ALL") ? user_crypto_amount : user_crypto_amount/2;
            const price = user_crypto_amount*convCryptoPrice;
            save(which,args[2],user_data,serverID,userID,userCash,price,user_crypto_amount);
            message.channel.send(`You have sold \`${user_crypto_amount} ${args[2]}\`\nCash: \`${(userCash+price).numeral()} ${base}\``);
        }
    }//+buy/sell BTC w/123432
    else if(which=="buy" && crypto_names.indexOf(args[1])!=-1 && args[2].substring(0,2)=="W/" && args[2].substring(2).indexOf(',')==-1){
        const cryptoDollarPrice = cryptos[args[1]].current.substring(1,cryptos[args[1]].current.length).replace(',','');
        const converted = (base!="USD") ? parseFloat(await getData.getData(message,"USD","eval"))*cryptoDollarPrice : cryptoDollarPrice;
        const amount = parseFloat(args[2].substring(2));
        if(amount>userCash && which=="buy") message.channel.send(`You dont have enough cash to buy. You have: \`${userCash.numeral()} ${base}\`` );
        else{
            const crypto_amount = amount/converted;
            save(which,args[1].toUpperCase(),user_data,serverID,userID,userCash,amount,crypto_amount);
            message.channel.send(`You bought \`${crypto_amount} ${args[1]}\` with \`${parseFloat(args[2].substring(2)).numeral()} ${base}\`\nRemaining cash: \`${parseFloat((userCash-amount).toFixed(3)).numeral()} ${base}\``);
        }
    }
    else message.channel.send("Invalid command");
}

function save(which,cryptoName,user_data,serverID,userID,userCash,amount,crypto_amount){
    const user = user_data[serverID][userID];
    console.log(user.investments[cryptoName]);
    if(user.investments[cryptoName]===undefined) user.investments[cryptoName] = String(crypto_amount);
    else user.investments[cryptoName] = (which=="buy") ? String(parseFloat(user.investments[cryptoName])+crypto_amount) : String(parseFloat(user.investments[cryptoName])-crypto_amount);
    (which=="buy") ? user.cash=String(userCash-amount) : user.cash=String(userCash+amount);
    fs.writeFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json',JSON.stringify(user_data,null,'\t'));
}

function findCryptoAmount(user,cryptoName){
    for(let crypto of Object.keys(user.investments))
        if(cryptoName===crypto)
            return parseFloat(user.investments[crypto]);
    return 0;
}
/*
function change(currencies,base){
    let i;
    for(let curr of currencies[base])
        if(curr.name=="USD")
            i=currencies[base].indexOf(curr);
    return parseFloat(currencies[base][i].current)
}
*/
async function rankings(message){
    const embed = new Discord.MessageEmbed(),profitsArr=[],map=new Map();
    const base = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\servers\\servers.json'))[message.guild.id].base_currency;
    const user_data = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json')); 
    const users = user_data[message.guild.id];
    let deletedUser = false;
    if(users == undefined) return "There is no profile to rank. Type `+profile` to create a one";
    for(let user of Object.keys(users).splice(1,Object.keys(users).length)){
        try{ await message.guild.members.fetch(user); }
        catch(err) { delete users[user]; deletedUser=true; }
    }
    if(deletedUser) fs.writeFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json', JSON.stringify(user_data,null,'\t'));
    for(let user of Object.keys(users).splice(1,Object.keys(users).length)){
        const profit = parseFloat((parseFloat((await netWorth_(users[user],base,message)))-parseFloat(users[user].start))); 
        const user_ = message.guild.members.cache.get(user);
        if(profitsArr.indexOf(profit)==-1) profitsArr.push(profit);
        if(map.get(profit)==undefined) map.set(profit,[`${user_.user.username}|${user_.user.id}`]);
        else map.set(profit,[...map.get(profit),`${user_.user.username}|${user_.user.id}`]);
    }
    let names="", profits="", netWorth="";
    for(let profit of profitsArr.sort(function(a, b){return b - a})){
        for(let user of map.get(profit)){
            names+=`${user.split('|')[0]}\n`;
            profits+=`\`${parseFloat(profit.toFixed(3)).numeral()} ${base}\`\n`;
            netWorth+=`\`${parseFloat(parseFloat(await netWorth_(users[user.split('|')[1]],base,message)).toFixed(3)).numeral()} ${base}\`\n`;
        }
    }

    const times = countdownTimer(users.time_created);
    const totalSecs = (21600-times.minutes)*60-times.seconds;
    const secs = totalSecs%60;
    const mins = Math.floor((totalSecs/60)%60);
    const hours = Math.floor((totalSecs/3600)%24);
    const days = Math.floor(totalSecs/(60*60*24));

    embed.setColor('#0099ff')
        .setTitle(`${message.guild.name} Leaderboard`)
        .addFields(
            {"name":"Name","value": names,inline:true},
            {"name":"Net Worth","value": netWorth,inline:true},
            {"name":"Profit","value": profits,inline:true}
        )
        .setFooter(`Rankings will be reset in ${days}d ${hours}h ${mins}m ${secs}s`);
    return embed;
}

function timer(){
    const user_data = JSON.parse(fs.readFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json'));
    for(const serverID of Object.keys(user_data)){
        const timer_ = countdownTimer(user_data[serverID].time_created);
        const minutes = timer_.minutes;
        const seconds =  timer_.seconds;
        if((minutes > 21594 || 21600 < minutes) && (user_data[serverID].process == undefined)){
            deleteServer(user_data,serverID,((21600-minutes)*60)-seconds);
        }
        else if(user_data[serverID].process===true)
            deleteServer(user_data,serverID,((21600-minutes)*60)-seconds);
    }
}

function countdownTimer(start){
    const total = Date.parse(new Date()) - Date.parse(start);
    const minutes = Math.floor(total/1000/60);
    const seconds = Math.floor((total/1000)%60);
    return {minutes,seconds};
}

async function deleteServer(data,serverID,seconds){
    setTimeout((data,serverID) => {
        delete data[serverID];
        fs.writeFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json',JSON.stringify(data,null,"\t"));
    },seconds*1000,data,serverID);
    if(data[serverID].process===undefined && seconds>0){
        data[serverID].process = true;
        fs.writeFileSync('C:\\Users\\user\\Desktop\\Currency Bot\\investment\\user_data.json',JSON.stringify(data,null,"\t"));
    }
}

module.exports = {
    main,
    invest,
    rankings,
    timer
}