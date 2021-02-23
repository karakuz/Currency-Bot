const rp = require('request-promise');
const $ = require('cheerio');
var fs = require('fs');

const functions = require('../body/functions');
const objects = require('./objects');
const cryptoHandler = require('../scrape/cryptoHandler');

var isDataReadable = true;
var timer;
var count = 0;
var timeoutCount=0;


const row = 'div.marketsData > div.box-row > div.box.box-12 > table > tbody > tr:nth-child($) >';
const alis = 'td:nth-child(3)';
const satis = 'td:nth-child(4)';
const degisim = 'td:nth-child(5)';

const data = {
    "currencies": [
        {"index" : "1", "name" : "USD", "highest" : "0"},
        {"index" : "2", "name" : "EUR", "highest" : "0"},
        {"index" : "3", "name" : "GBP", "highest" : "0"},
        {"index" : "5", "name" : "JPY", "highest" : "0"}
    ]
};

const url = 'https://www.bloomberght.com/doviz';

const dolarRecQuery = "div#HeaderMarkets > ul > li.live-dolar > ul.economy-data-detail li:last-child > a span:last-child";
const euroRecQuery = "div#HeaderMarkets > ul > li.live-euro > ul.economy-data-detail li:last-child > a span:last-child";

"li.live-dolar > a.marketsCol > span.data-info > small.value";

var eur=[],gbp=[],jpy=[],cny=[],inr=[],rub=[],tryy=[],usd=[];


const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
let bloomberg = async function(){
    count++;
    console.log(`been scraping ${count}th times`);
    timerFunc(1);
    rp(url)
        .then(function(html){
            //console.log(tryy);
            tryy=[];
            
            var newDolarPeak = functions.parse($(dolarRecQuery, html).text());
            var newEuroPeak = functions.parse($(euroRecQuery, html).text());

            let Data = JSON.parse(fs.readFileSync('./currencies/currency-data.json', 'utf8'));
            let dataDolarPeak = Data.currencies.TRY[0].highest;
            data["currencies"][0].highest = dataDolarPeak;
            let dataEuroPeak = Data.currencies.TRY[1].highest;
            data["currencies"][1].highest = dataEuroPeak;

            //SERVER BAZLI OLACAK SEKILDE

            if(parseFloat(newDolarPeak)>parseFloat(dataDolarPeak)){
                data["currencies"][0].highest = newDolarPeak;
                let msg = `USD/TRY - Yeni Rekor : ${dataDolarPeak} --> ${functions.now()}`;
                console.log(msg);
                //client.channels.cache.get('772926756704878603').send(msg);//loop
            }
            if(parseFloat(newEuroPeak)>parseFloat(dataEuroPeak)){
                data["currencies"][1].highest = newEuroPeak;
                let msg = `EUR/TRY - Yeni Rekor : ${dataEuroPeak} --> ${functions.now()}`;
                console.log(msg);
                //client.channels.cache.get('772926756704878603').send(msg);//loop
            }

            var query;
            data["currencies"].forEach(obj => {
                var curr, change;
                if(obj.name == "USD"){
                    curr = parseFloat(functions.parse($(`li.live-dolar > a.marketsCol > span.data-info > small.value`, html).text())).toFixed(4);
                    change = functions.parsePerc($(`li.live-dolar > a.marketsCol > span.data-info > small.value-diff`, html).text().trim());
                }
                else if(obj.name == "EUR"){
                    curr = parseFloat(functions.parse($(`li.live-euro > a.marketsCol > span.data-info > small.value`, html).text())).toFixed(4);
                    change = functions.parsePerc($(`li.live-euro > a.marketsCol > span.data-info > small.value-diff`, html).text().trim());
                }
                else{
                    query = `${row.replace('$', parseInt(obj.index))}`;
                    diff = (parseFloat(functions.parse($(`${query}${satis}`, html).text())) - parseFloat(functions.parse($(`${query}${alis}`, html).text())))/2;
                    curr = (diff + parseFloat(functions.parse($(`${query}${alis}`, html).text()))).toFixed(4);
                    change = functions.parsePerc("%" + $(`${query}${degisim}`, html).text());
                }
                
                
                tryy.push(new objects.tryObj(obj.name,curr,change,obj.highest));
            });
            console.log(`Currencies are read from ${url}, took ${timerFunc(0)} sec`);
        })
        .catch(async function(err){
            console.log("Problem occured while reading... \n" + err + "Trying again...");
            tryy=[];
            await wait(30000);
            bloomberg();
            return;
        });
    investing();
}

/*  1  EUR/USD     61 USD/EUR     1  GBP/USD    50 JPY/USD    70 CNY/USD    67 INR/USD    31 RUB/EUR   74 TRY/USD    
    2  EUR/GBP     63 USD/GBP     46 GBP/EUR    35 JPY/EUR    38 CNY/GBP    69 INR/GBP    32 RUB/GBP   40 TRY/EUR
    3  EUR/JPY     3  USD/JPY     3  GBP/JPY    36 JPY/GBP    37 CNY/EUR    68 INR/EUR    40 RUB/JPY   41 TRY/GBP
    45 EUR/CNY     52 USD/CNY     38 GBP/EUR    33 JPY/CNY    6  CNY/JPY    11 INR/JPY    61 RUB/USD   3  TRY/JPY
    64 EUR/INR     25 USD/INR     54 GBP/INR    67 JPY/RUB    42 CNY/INR    10 INR/CNY    37 RUB/INR   68 TRY/RUB
   104 EUR/RUB    112 USD/RUB     80 GBP/RUB    40 JPY/INR    64 CNY/RUB    51 INR/RUB    27 RUB/CNY   36 TRY/CNY
                                                              69 CNY/TRY    53 INR/TRY    59 RUB/TRY   46 TRY/INR
    */
   let currencies = [
    [61,63,3,52,25,112], //USD/...
    [1,2,3,45,64,104], //EUR/...
    [1,46,3,38,54,80], //GBP/...
    [50,35,36,33,67,40], //JPY/...
    [70,38,37,6,42,64,69], //CNY/...
    [67,69,68,11,10,51,53], //INR/...
    [31,32,40,61,37,27,59], //RUB/...
    [74,40,41,3,68,36,46] //TRY/...
];
/*  12 USD  41 CNY
    17 EUR  29 INR
    3  GBP  79 RUB
    2  JPY  9  TRY   */

let columns = [2,3,4,8];
let selectValues = ['17','3','2','41','29','79','9'];
let vals = ['EUR','GBP','JPY','CNY','INR','RUB','TRY'];
let raw_query = "div#cross_rates_container > table > tbody > tr:nth-child($)";
let query_col = " > td:nth-child($)";
var allCurrencies;

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const stealth = StealthPlugin();
stealth.enabledEvasions.delete("iframe.contentWindow");
puppeteer.use(stealth);

async function investing(){
    const browser = await puppeteer.launch();
    try {
        const url = "https://tr.investing.com/currencies/single-currency-crosses";

        //await browser.close();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        let start = new Date();
        
        console.log(`loading ${url}`);
        await page.goto(url);
        console.log("Starting to read...");
        
        let data = [];
        for(let curr of currencies){
            let currency = [];
            for(let i of curr){
                var query = raw_query.replace('$',i);
                let row2 = [];
                for(let col of columns){
                    row2.push(await page.evaluate((query) => {
                        return document.querySelector(query).innerHTML;
                    },query + query_col.replace('$',col)).catch(err => {console.log(err)}));
                }
                currency.push(row2);
            }
            data.push(currency);
            if(currencies.indexOf(curr)===selectValues.length) break;
            await page.select('select#symbols', selectValues[currencies.indexOf(curr)]);
            console.log(`Selecting ${vals[currencies.indexOf(curr)]},awaiting SPA Response`);
            await page.waitForSelector("div#loading_icon[style*='display: none'");
        }
        await browser.close();
        console.log(`Reading ${url} took ${(new Date()-start)/1000}secs`);
        
        for(let i=0; i<data.length; i++){
            for(let k=0; k<data[i].length; k++) data[i][k][0] = data[i][k][0].split('title="')[1].substring(0,7);
        }
        let arr1 =[];
        for(let i=0; i<data[0].length; i++){arr1.push([]);arr1[i].push(functions.rearrange(data[0][i]));}
        arr1.push([]);
        arr1.push([]);
        for(let i=1; i<data.length; i++){
            for(let j=0; j<data[i].length; j++){
                let curr = data[i][j][0].split('/')[1];
                for(let k=0; k<arr1.length; k++){
                    if(curr === arr1[k][0][0].split('/')[1]){arr1[k].push(functions.rearrange(data[i][j])); break;} 
                    if(curr === "USD"){arr1[arr1.length-1].push(functions.rearrange(data[i][j]));break;}
                    if(curr === "TRY"){arr1[arr1.length-2].push(functions.rearrange(data[i][j]));break;}
                }
            }
        }

        for(let curr of arr1){
            for(let roww of curr){
                switch(roww[0].split('/')[1]){
                    case 'EUR':
                        eur.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                    case 'GBP':
                        gbp.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                    case 'JPY':
                        jpy.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                    case 'CNY':
                        cny.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                    case 'INR':
                        inr.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                    case 'RUB':
                        rub.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                    case 'TRY':
                        tryy.push(new objects.tryObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2]),"0"));
                    break;
                    case 'USD':
                        usd.push(new objects.currencyObj(roww[0].split('/')[0],roww[1],functions.parsePerc(roww[2])));
                    break;
                }
            }
        }
        allCurrencies = new objects.currenciesAll(tryy,eur,usd,gbp,jpy,rub,inr,cny);
        writeData();
    } catch (error) {
        console.log(error);
        console.log("error occured, trying again");
        eur=[],gbp=[],jpy=[],cny=[],inr=[],rub=[],usd=[];
        await browser.close();
        timeoutCount++;
        await wait(20000);
        init();
        return;
    }
}


let writeData = function(){
    console.log("Saving JSON file...");
    let currencies = JSON.parse(fs.readFileSync('./currencies/currency-data.json'));
    currencies["currencies"] = allCurrencies; 
    var data = JSON.stringify(currencies,null,"\t");
    isDataReadable = false;
    fs.writeFile('./currencies/currency-data.json', data, (err) => {
        if(err){
            console.log('Error while writing data :' + err.message);
            return;
        }
        else {
            eur=[],gbp=[],jpy=[],cny=[],inr=[],rub=[],tryy=[],usd=[],allCurrencies=[];
            timeoutCount=0;
            isDataReadable = true;
            console.log("Data has been saved" + "\n-------------------");
        setTimeout(bloomberg,300000);
        }                    
    });
}

function check(){
    return new Promise(resolve => {
        var interval = setInterval(() => {
            (isDataReadable) ? stop() : console.log("Data writing is in progress, trying again...");
        }, 100);
        function stop(){
            clearInterval(interval);
            resolve(true);
        }
    });
}

function timerFunc(init){
    if(init) timer = new Date(); 
    else return (new Date()-timer)/1000;
}

let init = function(){
    if(timeoutCount<2){
        bloomberg();
    }
    else{
        console.log("Timedout more then once for the same process, exitting");
        timeoutCount=0;
        bloomberg();
    }
}

async function isReadable(){
    return await check();
}

module.exports = {
    init,
    isReadable
}