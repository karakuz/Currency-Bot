const getData = require('../scrape/getData');
const langHandler = require('../langs/langHandler');
const fs = require('fs');

module.exports.calculate = function(message){
    //console.log(message.content);
    let baseCurr = JSON.parse(fs.readFileSync('./servers/servers.json','utf-8'))[message.channel.guild.id]["base_currency"];//Servers base currency
    var symbols = ['$','€','£','₺','¥','₽','₹'];
    var curr = ['USD','EUR','GBP','TRY/TL','JPY/YEN','RUB','INR','CNY'];
    /*
    var index;
    curr.forEach((i) =>{
        i.split('/').forEach((x) => { if(x == baseCurr) index=curr.indexOf(i);})
    });
    symbols.splice(index,1);
    curr.splice(index,1);
    */
    if(message.content.indexOf('.') != -1){
        var zero = false;
        for(let i=message.content.length; i>message.content.indexOf('.'); i--){
            if(parseInt(message.content[i])==0){
                zero = true;
                console.log(parseInt(message.content[i])==0);
            }
            if(parseInt(message.content[i]) == NaN || parseInt(message.content[i])>0) break;
            if(zero) message.content = message.content.substring(0,i) + message.content.substring(i+1,message.content.length);
        }
    }
    var currName = message.content.substring(parseFloat(message.content).toString().length,message.content.length);
    if(symbols.indexOf(currName)==-1) if(curr.indexOf(currName)==-1) return;
    var amount = parseFloat(message.content);

    //8565432723132&
    currName=currName.toUpperCase();
    if(currName.length == 1) currName = curr[symbols.indexOf(currName)].split('/')[0];
    if(currName == "TL") currName = "TRY";
    if(currName == "YEN") currName = "JPY";

    console.log("Command (IN CALC): " + message.content);
    if(amount>1000000000000){message.channel.send(langHandler.response(["calc_err"],message,"")); return;}
    if(baseCurr == currName){
        let txt = `a`;
        curr.forEach(c => {
            if(c.split('/')[0] != baseCurr) 
                getData.getData(message,c.split('/')[0],"eval").then(res => {
                    txt = txt + setMsgTRY(res,c.split('/')[0]) + `\n`;
                    console.log(txt);
                });
        });
        //message.channel.send(txt);
    }
    else{
        console.log(currName);
        switch (currName.toUpperCase()) {
            case 'USD':
                getData.getData(message,"USD","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'EUR':
                getData.getData(message,"EUR","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'GBP':
                getData.getData(message,"GBP","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'TRY':
                getData.getData(message,"TRY","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'JPY':
                getData.getData(message,"JPY","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'RUB':
                getData.getData(message,"RUB","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'INR':
                getData.getData(message,"INR","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
            case 'CNY':
                getData.getData(message,"CNY","eval").then(res => message.channel.send(setMsg(res,baseCurr)));
            break;
        }
    }
    
    function setMsg(param,str) { return `${amount}${currName} = ${(param*amount).toFixed(3)} ${str}`;}
    function setMsgTRY(param,str){ return `${amount}${currName} = ${(amount/param).toFixed(3)} ${str}`;}
    
}