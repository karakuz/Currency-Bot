const Discord = require('discord.js');
const fs = require('fs');
const functions = require('../body/functions');

const satelliteIDs = ['793803431348797450','793866510996996127','793868823257939988'];
const wait = time => new Promise(resolve => setTimeout(resolve,time));
async function satelliteActivate(message){
    args = [0,message.guild.id,JSON.parse(fs.readFileSync('./auth/keys.json')).keys[0]];

    let data = JSON.parse(fs.readFileSync('./auth/keys.json'));
    let inServers = JSON.parse(fs.readFileSync('./auth/servers.json')).servers;

    if(inServers.indexOf(message.guild.id)!=-1){
        message.channel.send("Satellites are already activated! First update may take a while, please wait");
        return;
    }

    let success = false;
    satelliteIDs.forEach( ID => {
        if(message.channel.guild.members.cache.get(ID))
            success = true;
    });

    if(!success){
        message.channel.startTyping(5);
        for(let ID of satelliteIDs){
            await wait(1000);
            console.log("trying to fetch");
            try{message.guild.fetch(ID)}catch(err){console.log("SATELLITE FETCH ERROR");}
        }
        satelliteIDs.forEach( ID => {
            if(message.channel.guild.members.cache.get(ID))
                success = true;
        });
        if(!success){
            addAuth(message,args,data);
            message.channel.stopTyping(5);
        }
        else message.channel.send('Make sure that at least one of satellites are added. If you are sure that they were added, reinvite and then activate');
        return;
    }
    else if(data.keys.indexOf(args[2])!=-1) addAuth(message,args,data);
    else message.channel.send('Wrong key or unauthorized user');
}

function addAuth(message,args,data){
    let servers = JSON.parse(fs.readFileSync('./servers/servers.json'));
    servers[args[1]].satellites = "1";
    fs.writeFileSync('./servers/servers.json', JSON.stringify(servers,null,"\t"));

    data.keys.splice(data.keys.indexOf(args[2]),1);
    fs.writeFileSync('./auth/keys.json', JSON.stringify(data,null,'\t'));

    functions.addAuthServer(args[1]);
    message.channel.send("Satellites will be uptaded soon. First update may take a minute, hang tight!");
}

function removeAuth(guildID){
    const authServers = JSON.parse(fs.readFileSync('./auth/servers.json'));
    if(authServers.servers.indexOf(guildID) != -1){
        authServers.servers.splice(authServers.servers.indexOf(guildID),1);
        fs.writeFileSync('./auth/servers.json',JSON.stringify(authServers,null,"\t"));
    }
}

module.exports = {
    satelliteActivate,
    removeAuth
}