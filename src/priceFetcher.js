// Imports
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Console } = require('console');

// Variables

const priceDataPath = '../data/prices.json'
const pricesList = []
let convertionRate = 0

const NordPoolURL = 'https://www.nordpoolgroup.com/en/Market-data1/Dayahead/Area-Prices/NO/Daily/?view=table'
const EuroURL = 'https://investor.dn.no/#!/Valuta/Y24/Euro'
// delay function used for testing
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
        console.log("waiting for " + time + "ms");
    });
}

// Fetches the price from Nordpool

async function getPrice() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(NordPoolURL);

    // wait for page to load
    await delay(1000);

    // selectors

    const osloSelector = 'td[class="sortable"]:nth-of-type(2)'
    const kristiansandSelector = 'td[class="sortable"]:nth-of-type(3)'
    const bergenSelector = 'td[class="sortable"]:nth-of-type(4)'
    const moldeSelector = 'td[class="sortable"]:nth-of-type(5)'
    const trondheimSelector = 'td[class="sortable"]:nth-of-type(6)'
    const tromsoSelector = 'td[class="sortable"]:nth-of-type(7)'

    // list of selectors
    
    const selectorList = [osloSelector, kristiansandSelector, bergenSelector, moldeSelector, trondheimSelector, tromsoSelector]


    // loop through the selectors and get the price and add it to the pricesList
    for (let i = 0; i < selectorList.length; i++) {
        const priceString = await page.$eval(selectorList[i], (element) => {
            return element.textContent;
        })
        const price = priceString.replace(",", ".");
        pricesList.push(price)
    };

    // log the prices
    
    console.log("scraped data",pricesList);

    // close the browser
    
    await page.close();
    await browser.close();
    return pricesList;
}

// Fetches the Euro to NOK convertion rate from DN.no

async function EUROtoNOK(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(EuroURL);


    // what to search for
    const convertionRateSelector = 'div[class="price ng-binding"]'

    // use the selector to get the convertion rate
    const convertionRateString = await page.$eval(convertionRateSelector, (element) => {
        return element.innerText;
    })

    // switch the "," to "."
    convertionRate = convertionRateString.replace(",", ".");

    // convert to float
    convertionRate = parseFloat(convertionRate);
    console.log("convertionRate", convertionRate);

    await page.close();
    await browser.close();
    return convertionRate;
}

// Converts from MWH to KWH

async function convertToNOKperKWH(){
    for (let i = 0; i < pricesList.length; i++) {

        // convert to float
        pricesList[i] = parseFloat(pricesList[i]);

        // convert to NOK
        pricesList[i] = pricesList[i] * convertionRate;

        // convert to KWH
        pricesList[i] = pricesList[i] / 1000;

        // convert to "øre"
        pricesList[i] = pricesList[i] * 100;

        // round to 2 decimals
        pricesList[i] = Math.round(pricesList[i] * 100) / 100;

    }
    console.log("converton test", pricesList);
}

// run the functions
async function main() {
    
    // takes the time it takes to run the functions
    console.time('Execution time');
    await getPrice();
    await EUROtoNOK();
    await convertToNOKperKWH();

    console.log("-------------------------------")
    console.log("Øre per KWt i Oslo", pricesList[0]);
    console.log("Øre per KWt i Kristiansand", pricesList[1]);
    console.log("Øre per KWt i Bergen", pricesList[2]);
    console.log("Øre per KWt i Molde", pricesList[3]);
    console.log("Øre per KWt i Trondheim", pricesList[4]);
    console.log("Øre per KWt i Tromsø", pricesList[5]);
    console.log("-------------------------------")

    // takes the time it takes to run the functions
    console.timeEnd('Execution time');
    return pricesList;
}

exports.main = main;