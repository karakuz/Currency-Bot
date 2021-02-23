function currenciesAll(tryy,eur,usd,gbp,jpy,rub,inr,cny){
    this.TRY = tryy;
    this.EUR = eur;
    this.USD = usd;
    this.GBP = gbp;
    this.JPY = jpy;
    this.RUB = rub;
    this.CNY = cny;
    this.INR = inr;
}

function tryObj(name, current, change, highest){
    this.name = name;
    this.current = current;
    this.change = change;
    this.highest = highest;
}

function currencyObj(name, current, change){
    this.name = name;
    this.current = current;
    this.change = change;
}

function serverObj(name,lang,base_currency,satellites,custom_commands,crypto_base){
    this.name = name;
    this.lang = lang;
    this.base_currency = base_currency;
    this.satellites = satellites;
    this.custom_commands = custom_commands;
    this.crypto_base = crypto_base;
}

module.exports = {
    currenciesAll,
    tryObj,
    currencyObj,
    serverObj
}