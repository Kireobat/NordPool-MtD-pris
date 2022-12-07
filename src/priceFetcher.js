// Imports
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Variables

const priceDataPath = '../data/prices.json'
const pricesList = []

const url = 'https://www.nordpoolgroup.com/en/Market-data1/Dayahead/Area-Prices/NO/Daily/?view=table'

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
    await page.goto(url);

    // wait for page to load
    await delay(3000);

    // selectors

    const osloSelector = 'td[class="sortable"]:nth-of-type(2)'
    const kristiansandSelector = 'td[class="sortable"]:nth-of-type(3)'
    const bergenSelector = 'td[class="sortable"]:nth-of-type(4)'
    const moldeSelector = 'td[class="sortable"]:nth-of-type(5)'
    const trondheimSelector = 'td[class="sortable"]:nth-of-type(6)'
    const tromsoSelector = 'td[class="sortable"]:nth-of-type(7)'

    // list of selectors
    
    const selectorList = [osloSelector, kristiansandSelector, bergenSelector, moldeSelector, trondheimSelector, tromsoSelector]

    for (let i = 0; i < selectorList.length; i++) {
        const price = await page.$eval(selectorList[i], (element) => {
            return element.textContent;
        })
        pricesList.push(price)
    };

    // log the prices
    
    console.log("scraped data",pricesList);

    // close the browser
    
    await page.close();
    await browser.close();
    return pricesList;
}

getPrice();