const objects = require('../scrape/objects');
const fs = require('fs');
const functions = require('C:\\Users\\user\\Desktop\\Currency Bot\\body\\functions');

function isNewServer(client,serverID) {
    const server = client.guilds.cache.get(serverID);
    const data = JSON.parse(fs.readFileSync('./servers/servers.json','utf8'));
    let newServer = {};
    if(!data[server.id]){
        newServer = new objects.serverObj(server.name,'english','EUR','0',[],'USD');
        data[server.id] = newServer;
        fs.writeFileSync("./servers/servers.json", JSON.stringify(data,null,"\t"));
        client.channels.cache.get('799416857873350696').send(functions.addLogger(server));
    }
}

function checkServers(client){
    const data = JSON.parse(fs.readFileSync('./servers/servers.json','utf8'));
    let cacheServers = client.guilds.cache.keyArray();
    Object.keys(data).forEach( serverID => {
        cacheServers.splice(cacheServers.indexOf(serverID),1);
    });
    cacheServers.forEach(serverID => {
        isNewServer(client,serverID);
    });
}

async function addServer(client,guild){
    const serverID = guild.id;
    const serverName = guild.name;
    let data = JSON.parse(fs.readFileSync('./servers/servers.json','utf8'));
    const newServer = new objects.serverObj(serverName,'english','EUR','0',[],'USD');
    data[serverID] = newServer;
    client.channels.cache.get('799416857873350696').send(await functions.addLogger({name: serverName, id: serverID}));
    fs.writeFileSync("./servers/servers.json", JSON.stringify(data,null,"\t"));
}

async function removeServer(client,serverID){
    let data = JSON.parse(fs.readFileSync('./servers/servers.json','utf8'));
    console.log("entring logger");
    client.channels.cache.get('799416857873350696').send(await functions.removeLogger({name: data[serverID].name, id: serverID}));
    Object.keys(data).forEach( (id) => {
        if(id==serverID)
            delete data[serverID];
    });

    fs.writeFileSync("./servers/servers.json", JSON.stringify(data,null,"\t"));

}

function findRemoved(client){
    let dataIDs = Object.keys(JSON.parse(fs.readFileSync('./servers/servers.json','utf8')));
    let cacheServers = client.guilds.cache.keyArray();
    cacheServers.forEach(serverID => {
        dataIDs.splice(dataIDs.indexOf(serverID),1);
    });
    console.log("Removed Channel ID's: " + dataIDs);
    return dataIDs;
}

module.exports = {
    checkServers,
    addServer,
    removeServer,
    findRemoved
}