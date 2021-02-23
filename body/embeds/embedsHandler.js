const fs = require('fs');

const helpEmbed = require('./helpEmbed');
const currCommands = require('./currEmbed');
const cryptosHelp = require('./cryptocurrencies');
const investmentHelp = require('./investment');
const cryptoAllEmbed = require('../../scrape/cryptoHandler');
/*
    1: Help
    2: Currency Commands
    3: Crypto Commands
    4: Fake Investment Commands
*/
const wait = (time) => new Promise(resolve => setTimeout(resolve,time));
async function pages(reaction,user){
    const embed = reaction.message.embeds[0];
    const pageNumber = embed.footer.text.split(' ')[1][0];
    const lang = JSON.parse(fs.readFileSync('./servers/servers.json'))[reaction.message.channel.guild.id].lang;
    let new_embed;
    if(reaction.emoji.name == '⬅️' && pageNumber!='1'){
        new_embed = (pageNumber=='4') ? await cryptosHelp.getEmbed(reaction.message,true) : (pageNumber=='3') ? await currCommands.getEmbed(reaction.message,true) : await helpEmbed.getEmbed(reaction.message,null,true);
        
        if(lang==="english") new_embed.setFooter("Page " + String(parseInt(pageNumber)-1)+"/4");
        else if(lang==="turkish") new_embed.setFooter("Sayfa " + String(parseInt(pageNumber)-1)+"/4");
    }
    else if(reaction.emoji.name == '🗑️') reaction.message.delete();
    
    else if(reaction.emoji.name == '➡️'&& pageNumber!='4'){
        new_embed = (pageNumber=='1') ? await currCommands.getEmbed(reaction.message,true) : (pageNumber=='2') ? await cryptosHelp.getEmbed(reaction.message,true): investmentHelp.getEmbed(reaction.message);
        
        if(lang==="english") new_embed.setFooter("Page " + String(parseInt(pageNumber)+1)+"/4");
        else if(lang==="turkish") new_embed.setFooter("Sayfa " + String(parseInt(pageNumber)+1)+"/4");
    }

    if(reaction.emoji.name != '🗑️'){
        reaction.message.edit(new_embed);
        await wait(500);
        reaction.users.remove(user);    
    }
}

async function cryptoNamePages(reaction,user){
    const embed = reaction.message.embeds[0];
    const pageNumber = embed.footer.text.split(' ')[1][0];

    let new_embed;
    if((reaction.emoji.name==='⬅️' && pageNumber==='1') || (reaction.emoji.name==='➡️'&& pageNumber==='5')){
        await wait(500);
        reaction.users.remove(user);
        return;
    } 
    else if(reaction.emoji.name === '🗑️') reaction.message.delete();
    else if(reaction.emoji.name === '➡️'){
        new_embed = await cryptoAllEmbed.getAllNames(null,null,parseInt(pageNumber)+1);
    }
    else if(reaction.emoji.name === '⬅️'){
        new_embed = await cryptoAllEmbed.getAllNames(null,null,parseInt(pageNumber)-1);

    }

    
    if(reaction.emoji.name != '🗑️'){
        reaction.message.edit(new_embed);
        await wait(500);
        reaction.users.remove(user);    
    }
}

module.exports = {
    pages,
    cryptoNamePages
}