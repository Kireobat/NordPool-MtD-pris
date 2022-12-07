// Imports
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Variables

const dataPath = ''
const pricesList = []

const url = 'https://www.nordpoolgroup.com/en/Market-data1/Dayahead/Area-Prices/NO/Daily/?view=table'

let osloPriceToday = ""
/*
let kristiansandPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(3)').innerText;
let bergenPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(4)').innerText;
let moldePriceToday = document.querySelector('td[class="sortable"]:nth-of-type(5)').innerText;
let trondheimPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(6)').innerText;
let tromsoPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(7)').innerText;
*/
// Velger riktig rute for å hente ut pris
// document.querySelector('td[class="sortable"]:nth-of-type(x)').innerText

// Fetches the price from Nordpool

async function getPrice() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);


    /*
    osloPriceTodayText = await page.$("td[class='sortable']:nth-of-type(2)");
    osloPriceToday = await (await osloPriceTodayText.getProperty('innerText')).jsonValue();
    */

    const value = await page.evaluate(
        () => document.querySelectorAll("td[class='sortable']")[0].innerHTML
    );


    pricesList.push(value);
    console.log("prisliste1",pricesList);
    console.log("oslopris",value);
    await browser.close();
    return pricesList;
}

getPrice();