const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const functions = require('./body/functions');

Number.prototype.conv = function() {
    return (Math.floor(this.valueOf()/10)==0) ? "0.0"+String(this.valueOf()) : "0."+String(this.valueOf());
}

const url = 'https://coinmarketcap.com/all/views/all/';

async function getCryptos(){
    let history = JSON.parse(fs.readFileSync("./currencies/history.json")),cryptos={};
    console.log("Reading...");
    const start = new Date();
    rp(url)
        .then(async function(html){
            const html_ = $("table > tbody",html)[0];
            for(let i=0; i<100; i++){
                const abbrv = html_.children[i].children[2].children[0].children[0].data;
                const name = html_.children[i].children[1].children[0].children[1].children[0].data;
                const marketCap = html_.children[i].children[3].children[0].children[0].data;
                const current = html_.children[i].children[4].children[0].children[0].children[0].data;
                const hourly = html_.children[i].children[7].children[0].children[0].data;
                const daily = html_.children[i].children[8].children[0].children[0].data;
                const weekly = html_.children[i].children[9].children[0].children[0].data;
                
                const obj = change({"name" : name,"current" : current,"hourly" : hourly,"daily" : daily,"weekly" : weekly,"market_cap" : marketCap})

                cryptos[abbrv] = {
                    "name" : name,
                    "current" : obj.current,
                    "hourly" : `%${obj.hourly.toFixed(2)}`,
                    "daily" : `%${obj.daily.toFixed(2)}`,
                    "weekly" : `%${obj.weekly.toFixed(2)}`,
                    "market_cap" : marketCap
                };
                //history[abbrv][start.toString().substring(4,24)]=current;
            }
            fs.writeFileSync('./currencies/currency-data.json', JSON.stringify(cryptos,null,"\t"));
            fs.writeFileSync('./currencies/history.json', JSON.stringify(history,null,"\t"));
            console.log(`Cryptos have been saved! Took ${(new Date()-start)/1000} secs\n--------------------------`);
        });
}

function change(obj){
    const crypto_price = parseFloat(obj.current.replace(',','').replace('$',''));
    const price_1h = parseFloat((crypto_price/100)*(100-parseFloat(obj.hourly))).toFixed(2);

    let rand_num = (Math.abs(parseInt(obj.hourly))<20) ? Math.abs(parseInt(obj.hourly))+1 : 20;
    const random_1h = Math.floor(Math.random()*(7*rand_num));
    const perc_1h_change = (!dice()) ? random_1h.conv() : random_1h.conv()*-1;
    
    rand_num = (Math.abs(parseInt(obj.daily))<20) ? Math.abs(parseInt(obj.daily))+1 : 20;
    const random_daily = Math.floor(Math.random()*(7*rand_num));
    const perc_daily_change = (!dice()) ? random_daily.conv() : random_daily.conv()*-1;

    rand_num = (Math.abs(parseInt(obj.weekly))<20) ? Math.abs(parseInt(obj.weekly))+1 : 20;
    const random_weekly = Math.floor(Math.random()*(7*rand_num));
    const perc_weekly_change = (!dice()) ? random_weekly.conv() : random_weekly.conv()*-1;

    const perc_1h = parseFloat(obj.hourly)+parseFloat(perc_1h_change);
    const perc_daily = parseFloat(obj.daily)+parseFloat(perc_daily_change);
    const perc_weekly = parseFloat(obj.weekly)+parseFloat(perc_weekly_change);
    const price = ((price_1h/100)*(100+perc_1h)).toFixed(2);
    
    return {current : price, hourly: perc_1h, daily: perc_daily, weekly: perc_weekly}
}

function dice(){return (Math.random()<0.5)?0:1;}

console.log("Starting...");
getCryptos();