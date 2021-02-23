const Discord = require('discord.js');
var client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION','USER',"GUILD_MEMBER"] });
const dcToken = 'Nzc2NTgwMDAwODA2NjAwNzA2.X628fA.WW7nEg8NF8Q7IcWSuuK7kTOngEY';
const PREFIX = '-';
//const ms = 317000;

const fs = require('fs');
//web-scrape
const scrape = require('./scrape/scraper');
//User made functions
const functions = require('./body/functions');

client.on('ready', () => {
    console.log("Bot ready");

    onSince = functions.now();
    client.user.setActivity('+investment', {type: 'WATCHING'}).catch(console.error());

    console.log("Guild size: " + client.guilds.cache.size);
    /*
    let servers = JSON.parse(fs.readFileSync('./servers/servers.json','utf8'));
    if(Object.keys(servers).length < client.guilds.cache.size){
        console.log("A server was added while bot was offline, adding to db");
        serverHandler.checkServers(client);
    }
    else if(Object.keys(servers).length > client.guilds.cache.size){
        console.log("A server was removed while bot was offline, removing from db");
        //functions.removeLogger(guild);
        let removedChannels = serverHandler.findRemoved(client);
        for(let channelID of removedChannels)
            serverHandler.removeServer(client,channelID);
    }
    */
    //client.channels.cache.get('792466884880105483').send("Here for free satellite feature? Dm <@225615132011659266> to claim");

    //SERVER DATA
    //console.log(client.guilds.cache.get('792464083420839947'));
    
    //client.channels.cache.get('315445287374028800').send('bi daha<@290153479622623233>')
    //functions.react_(client);
    console.log("Interval Starting...");
    setTimeout(scrape.init,100000);
    setInterval(functions.isActive, 37000);
});

client.on('rateLimit', (...args) => {
    console.log(...args);
    client.channels.cache.get('800562158231879692').send("Rate Limit <@225615132011659266>");
    //process.exit(1);
});
/*
client.on('debug', (...args) => {
    console.log(...args);
});
*/
const serverHandler = require('./servers/serverHandler');
const satelliteHandler = require('./currencies/satelliteHandler');
client.on('guildCreate', (guild) =>{
    console.log(`Name: ${guild.name}, ID: ${guild.id} -> joined to the guild`);
    serverHandler.addServer(client,guild);
});

client.on('guildDelete', (guild) =>{
    console.log(`Name: ${guild.name}, ID: ${guild.id} -> left the guild`);
    serverHandler.removeServer(client,guild.id);
    satelliteHandler.removeAuth(guild.id);
});

//HANDLING REACTIONS ON SUPPORT SERVER
const embedHandler = require('./body/embeds/embedsHandler');
client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.channel.id === '791219178220421140'){
        let message = reaction.message;
        let emoji = reaction.emoji;

        if (emoji.name == '🇬🇧') {; 
            message.fetch(user.id).then(async message => {
                let userInfo = message.channel.guild.members.cache.get(user.id);
                await userInfo.roles.remove('775743677876273185');

                let msg = client.channels.cache.get('791219178220421140').messages.cache.get('792133953397456946');             
                let tr_reactions = await getReactedUsers('791219178220421140','792133953397456946','🇹🇷');
                await msg.fetch('🇹🇷');
                tr_reactions.forEach(async userID => {
                    await msg.reactions.cache.get('🇹🇷').fetch(userID);
                });
                if(user.id!='770976131091529738') await msg.reactions.cache.get('🇹🇷').users.remove(user.id);
                
                await userInfo.roles.add('791237803622793227');
            });
        }
        else if(emoji.name == '🇹🇷'){
            message.fetch(user.id).then(async message => {
                let userInfo = message.channel.guild.members.cache.get(user.id);
                await userInfo.roles.remove('791237803622793227');

                let msg = client.channels.cache.get('791219178220421140').messages.cache.get('792133953397456946');             
                let tr_reactions = await getReactedUsers('791219178220421140','792133953397456946','🇬🇧');
                await msg.fetch('🇬🇧');
                tr_reactions.forEach(async userID => {
                    await msg.reactions.cache.get('🇬🇧').fetch(userID);
                });
                if(user.id!='770976131091529738') await msg.reactions.cache.get('🇬🇧').users.remove(user.id);

                await userInfo.roles.add('775743677876273185');
            });
        }
        else{ reaction.users.remove(user); }
    }
    if(reaction.message.author != null 
        && reaction.message.author.id==='776580000806600706' 
        && reaction.message.embeds[0].description!=="Type '+' front to run.\nEx: `+btc`" 
        && user.id!='776580000806600706')
            embedHandler.pages(reaction,user);
    if(reaction.message.author != null 
        && reaction.message.author.id==='776580000806600706' 
        && reaction.message.embeds[0].description==="Type '+' front to run.\nEx: `+btc`" 
        && user.id!='776580000806600706')
            embedHandler.cryptoNamePages(reaction,user); 
});

async function getReactedUsers(channel, messageID, emoji){
    let res=[];
    await client.channels.cache.get(channel).messages.fetch(messageID)
        .then(async reactionMessage => {
            let users = [];
            await reactionMessage.reactions.resolve(emoji).users.fetch()
                .then(userList => {
                    userList.map((user) => {
                        users.push(user.id);
                    })
                });
    });
    return res;
}

//Commands
const commands = require('./body/commands');
client.on('message', (message) => {
    commands.readCommand(message,PREFIX,client);    
});

const timer = require('./investment/profileHandler');
client.login(dcToken)
    .then(setInterval(timer.timer,180000))
    .catch(err => console.log("MAIN ERROR:\n"+err));
    //.then(() => console.log(client.guilds.cache.size))

/*
    .fetch()
    .then(userList => {
        userList.map((user) => console.log(user.id))
    });
*/

