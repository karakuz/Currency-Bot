const Discord = require('discord.js');
const fs = require('fs');
const { setTimeout } = require('timers');

const wait = time => new Promise(resolve => setTimeout(resolve,time));

Number.prototype.numeral = function () {
    let number=String(this.valueOf());
    if(number.indexOf('.')!=-1)
        for(let i=number.indexOf('.')-3; i>0; i-=3)
            number = number.substring(0,i) + ',' + number.substring(i);
    else
        for(let i=number.length-3; i>0; i-=3)
            number = number.substring(0,i) + ',' + number.substring(i);
    return number;
}

function now(){
    var now = new Date();
    now = String(now.getDate()).padStart(2, '0') + '-' 
        + String(now.getMonth() + 1).padStart(2, '0') + '-' 
        + String(now.getFullYear()) + ' '
        + String(now.getHours()).padStart(2, '0') + ':'
        + String(now.getMinutes()).padStart(2, '0') + ':'
        + String(now.getSeconds()).padStart(2, '0');
    return now;
}

function parse(data){ return `${data.split(',')[0] + "." + data.split(',')[1]}`;}
function parsePerc(data){
    var emoji = (data.includes('-')) ? ":small_red_triangle_down:" : ":arrow_up_small:";
    return (data[1] === " ") ? `%${data.substring(2)}${emoji}` 
            : data[0] === "%" ? `${data}${emoji}`
            : `%${(data.includes('+')) ? data.substring(1,data.length-1).split(' ')[0]
            : data.substring(0,data.length-1).split(' ')[0]}${emoji}`;
}

function checkInternet(){
    require('dns').resolve('www.google.com', function(err) {
        if (err) {
           console.log("No connection");
        } else {
           console.log("Connected");
        }
      });
}

function checkPermission(msg){
    var userID = msg.author.id;
    //console.log(msg.guild.members.cache.get(userID).hasPermission('ADMINISTRATOR'));
    return msg.guild.members.cache.get(userID).hasPermission('ADMINISTRATOR');
}

function rearrange(row){
    let diff = parseFloat(row[2].replace(',','.')) - parseFloat(row[1].replace(',','.'));
    let val = parseFloat(row[1].replace(',','.')) + (diff/2);
    return [row[0],String(val.toFixed(4)),row[3]];
}

function react_(client){
    //console.log(channel);
    var channel = client.channels.cache.get('791219178220421140');
    channel.messages.fetch('792133953397456946')
    .then(async message =>{
        await message.react("🇹🇷");
        await message.react("🇬🇧");
    })
}

function isActive(){
    console.log(`Bot is alive, ${new Date()}`);
}

function logger(message){
    const loggerEmbed = new Discord.MessageEmbed();
    loggerEmbed.addField(new Date() , `Command: ${message.content},  by: ${message.author.username},  in(Server): ${message.guild.name}`);
    return loggerEmbed;
}

async function addLogger(guild){
    await wait(1200);
    const loggerEmbed = new Discord.MessageEmbed();
    loggerEmbed.addField(":inbox_tray:BOT IS ADDED TO A SERVER" , `Name: ${guild.name}, ID: ${guild.id} -> joined to the guild`)
    return loggerEmbed;
}
async function removeLogger(guild){
    await wait(1200);
    const loggerEmbed = new Discord.MessageEmbed();
    loggerEmbed.addField(":outbox_tray:BOT IS REMOVED FROM A SERVER" , `Name: ${guild.name}, ID: ${guild.id} -> exited from the guild`)
    console.log(":outbox_tray:BOT IS REMOVED FROM A SERVER" + `\nName: ${guild.name}, ID: ${guild.id} -> exited from the guild`);
    return loggerEmbed;
}

function addAuthServer(serverID){
    let servers = JSON.parse(fs.readFileSync('./auth/servers.json'));
    servers["servers"].push(serverID);
    fs.writeFileSync('./auth/servers.json', JSON.stringify(servers,null,"\t"));
}

module.exports = {
    checkInternet,
    now,
    parse,
    parsePerc,
    checkPermission,
    rearrange,
    react_,
    isActive,
    logger,
    addLogger,
    removeLogger,
    addAuthServer
}

