const fs = require('fs');
const scrape = require('./scraper');
const langHandler = require('../langs/langHandler');

let getData = async (msg, currType, sendType) => {
    await scrape.isReadable();
    //console.log(res);
    return new Promise(resolve => {
        let index = 0;
        let str;
        let base_currency = JSON.parse(fs.readFileSync('./servers/servers.json', 'utf-8'))[msg.channel.guild.id].base_currency;//Server's currency
        let isRecord = (currType.substring(currType.length-6) == "record") ? true : false;
        let currencyName = (isRecord)? currType.split('record')[0] : currType;
        let Data = JSON.parse(fs.readFileSync('./currencies/currency-data.json', 'utf8')).currencies[base_currency];
        for(;index<Data.length; index++){if(Data[index].name == currencyName) break}
        (index == Data.length) ? resolve(langHandler.response(["getData_base_err"],msg,base_currency)) : Data = Data[index];
        (sendType === "print") ? 
            str=(!isRecord) ? `${currencyName}/${base_currency} ${Data.current} ${Data.change}` 
                            : (base_currency=="TRY") 
                                ? `${currencyName}/${base_currency} ${langHandler.response(["record_translates"],msg,"")} ${Data.highest}` 
                                : langHandler.response(["record_err"],msg,currencyName) 
        : str = Data.current;
        resolve(str);
    });
}



module.exports = {
    getData,
}