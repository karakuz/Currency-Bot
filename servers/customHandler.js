const functions = require('../body/functions');
const fs = require('fs');
const langHandler = require('../langs/langHandler');

var text = 0;
var success = false;
var cmd, txt, err, userID, channelID,err2;
var msgObj;

function addCustomCmd(message){
    msgObj=message;
    let isAuth = functions.checkPermission(message);
    if(!isAuth) {message.channel.send(langHandler.response(["perm_err"],message,"")); return;}
    const filter = m => !m.author.bot;
    if(JSON.parse(fs.readFileSync('./servers/servers.json','utf-8'))[message.channel.guild.id].custom_commands.length>10){
        message.channel.send(langHandler.response(["addcustom_max_err"],message,""));
        return;    
    }
    userID=message.author;
    channelID=message.channel.id;
    message.channel.send(langHandler.response(["addcustom"],message,""));
    const collector = message.channel.createMessageCollector(filter, { time: 30000 });

    collector.on('collect', async m => {
        err = false;
        err2 = false;
        if(/\W/.test(m.content) && !text){
            err = true;
            collector.stop();
            addCustomCmd(message);
        }
        else if(!text){
            if((userID == msgObj.channel.messages.cache.get(msgObj.channel.lastMessageID).author.id && channelID == message.channel.id)){
                cmd = m;
                if(!isExists(message,cmd)){
                    message.channel.send(langHandler.response(["addcustom2"],message,""));
                    text=1;
                }
                else{
                    err2 = true;
                    userID = undefined;
                    channelID = undefined;
                    collector.stop();
                }              
            }
        } else{
            txt = m;
            success = true;
            collector.stop();
        }
    });

    collector.on('end', () => {
        if(err) message.channel.send(langHandler.response(["addcustom_err3"],message,""));
        if(err2) message.channel.send(langHandler.response(["addcustom_err2"],message,cmd));
        else if(!success) message.channel.send(langHandler.response(["addcustom_err"],message,""));
        else{
            message.channel.send(langHandler.response(["addcustom3"],message,cmd));
            text = 0;
            success = false;
            let servers = JSON.parse(fs.readFileSync('./servers/servers.json','utf-8'));//Servers
            servers[message.channel.guild.id].custom_commands.push({"command" : cmd.content, "text" : txt.content});
            fs.writeFileSync('./servers/servers.json', JSON.stringify(servers,null,"\t"));
        }
    });
    
}

function removeCustomCmd(message, args){
    let cmdName = args[1];
    let success = false;
    if(cmdName == undefined) return message.channel.send(langHandler.response(["removecustom_err2"],message,""));
    let servers = JSON.parse(fs.readFileSync('./servers/servers.json','utf-8')); 
    let customs = servers[message.channel.guild.id]["custom_commands"];//Servers Custom Commands
    let index = -1;
    customs.forEach( (obj) => {
        index++;
        if(obj.command == cmdName){
            customs.splice(customs[index],1);
            servers[message.channel.guild.id]["custom_commands"] = customs;
            success=true;
        }
    });
    fs.writeFileSync('./servers/servers.json', JSON.stringify(servers,null,"\t"));
    if(!success) message.channel.send(langHandler.response("removecustom_err3",message,args[1]));
    else message.channel.send(langHandler.response(["removecustom_success"],message,args[1]));
}

function isExists(message,cmd){
    let res = false;
    let customs = JSON.parse(fs.readFileSync('./servers/servers.json','utf-8'))[message.channel.guild.id]["custom_commands"];
    customs.forEach( (obj) => {
        if(obj.command == cmd.content)
            res = true;
    });
    return res;
}

module.exports = {
    addCustomCmd,
    removeCustomCmd
}

