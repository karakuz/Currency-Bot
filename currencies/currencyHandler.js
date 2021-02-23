const fs = require('fs');
const langHandler = require('../langs/langHandler');
const functions = require('../body/functions');

function setBase(args, msg){
    //if(!functions.checkPermission(msg)) return langHandler.response(["perm_err"],msg,"");
    if(args[1] === undefined) return langHandler.response(["setbase_missingInfo"],msg,"");

    let serverData = JSON.parse(fs.readFileSync('./servers/servers.json','utf-8'));
    let currData = JSON.parse(fs.readFileSync('./currencies/currency-data.json','utf-8'));
    let isExists = false;

    let except = ["TL","YEN"];
    let except2 = ["TRY","JPY"];
    let index = except.indexOf(args[1].toUpperCase());
    if(index != -1){
        isExists = true;
        args[1] = except[index];
    }
    else{
        Object.keys(currData["currencies"]).forEach((key) => {
            if(args[1].toUpperCase() == key) isExists = true;
        })
    }
    if(isExists){
        if(index != -1) serverData[msg.channel.guild.id]["base_currency"] = except2[index];
        else serverData[msg.channel.guild.id]["base_currency"] = args[1].toUpperCase();
        
        fs.writeFileSync('./servers/servers.json', JSON.stringify(serverData,null,"\t"));
        if(index == -1)
            return langHandler.response([args[0]],msg,args[1].toUpperCase());
        return langHandler.response([args[0]],msg,except2[index].toUpperCase());
    }
    else {
        return langHandler.response(["setbase_err"],msg,args[1]);
    }
} 

function getBases(){
    let currData = JSON.parse(fs.readFileSync('./currencies/currency-data.json','utf-8'));
    let res = "";
    Object.keys(currData["currencies"]).forEach((key) => {
        res = res + key + ",";
    })
}


module.exports = {
    setBase,
    getBases
}
