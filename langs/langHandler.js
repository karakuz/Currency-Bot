const fs = require('fs');
const functions = require('../body/functions');

function getCommand(args, msg){
    let serverInfo = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id];
    if(serverInfo){
        if(isCustom(args,serverInfo) != false) return [isCustom(args,serverInfo), "custom"];
        let lang = serverInfo.lang;//Server's language
        
        console.log(args[0]);
        let langs = JSON.parse(fs.readFileSync("./langs/commands.json",'utf-8'));//Commands
        var index = langs[lang]["commands"].indexOf(args[0].toLowerCase());
        if(index == -1) return "not in commands.json";
        else{
            args.splice(0,1);
            return [langs['english']["commands"][index], ...args];
        }         
    }
}

function isCustom(args,server){
    let res = false;
    server["custom_commands"].forEach(cmd => {
        if(cmd.command === args[0]) res = cmd.text;
    });
    return res;
}

function changeLanguage(args, msg){
    //if(!functions.checkPermission(msg)) {msg.channel.send(response(["perm_err"],msg,"")); return;}
    let lang = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id].lang;//Server's language
    let langs = JSON.parse(fs.readFileSync("./langs/commands.json",'utf-8'));//All Languages
    if(args[1] === undefined) msg.channel.send(response(["set_lang_missingInfo"],msg,""));
    else{
        let index = langs[lang]["langs"].indexOf(args[1].toLowerCase());
        args[1] = langs["english"]["langs"][index];

        if(lang === args[1]){msg.channel.send(response(["lang_err"],msg,langs[lang]["langs"][index])); return;}
        if(!langs[args[1]]) msg.channel.send(response(["lang_err2"],msg,""));
        else{
            let serverData = JSON.parse(fs.readFileSync("./servers/servers.json",'utf-8'));
            serverData[msg.channel.guild.id].lang = args[1];
            fs.writeFileSync('./servers/servers.json', JSON.stringify(serverData,null,"\t"));
            msg.channel.send(response(args,msg,""));   
        } 
    }
}

function languages(args,msg){
    let lang = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id].lang;//Server's language
    let langs = JSON.parse(fs.readFileSync("./langs/commands.json",'utf-8'));
    let res = "";
    langs[lang]["langs"].forEach(l => {
        res = res + l + ",";
    });
    res = res.substring(0,res.length-1);
    return response(args,msg,res);
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
    getCommand,
    changeLanguage,
    response,
    languages
}
