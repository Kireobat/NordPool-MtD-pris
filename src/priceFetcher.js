// Imports
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Variables

const dataPath = ''
const pricesList = []

const url = 'https://www.nordpoolgroup.com/en/Market-data1/Dayahead/Area-Prices/NO/Daily/?view=table'

/*
let kristiansandPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(3)').innerText;
let bergenPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(4)').innerText;
let moldePriceToday = document.querySelector('td[class="sortable"]:nth-of-type(5)').innerText;
let trondheimPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(6)').innerText;
let tromsoPriceToday = document.querySelector('td[class="sortable"]:nth-of-type(7)').innerText;
*/
// Velger riktig rute for å hente ut pris
// document.querySelector('td[class="sortable"]:nth-of-type(x)').innerText

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
    await delay(3000);
    await page.screenshot({path: 'example.png'});


    /*
    osloPriceTodayText = await page.$("td[class='sortable']:nth-of-type(2)");
    osloPriceToday = await (await osloPriceTodayText.getProperty('innerText')).jsonValue();
    */
    /*
    const value = await page.evaluate(
        () => document.querySelectorAll("td[class='sortable']")[1].innerText
    );
    */

    /*
    let scrapedData = await page.evaluate(() => {
        Array.from(document.querySelectorAll("td[class='sortable']")[0]).map((element => ({
            price: element.innerText
        })))
    });
    */

    const osloSelector = 'td[class="sortable"]:nth-of-type(2)'
    const kristiansandSelector = 'td[class="sortable"]:nth-of-type(3)'
    const bergenSelector = 'td[class="sortable"]:nth-of-type(4)'
    const moldeSelector = 'td[class="sortable"]:nth-of-type(5)'
    const trondheimSelector = 'td[class="sortable"]:nth-of-type(6)'
    const tromsoSelector = 'td[class="sortable"]:nth-of-type(7)'


    const osloPriceToday = await page.$eval(osloSelector, (element) => {
        return element.textContent;
    })

    const kristiansandPriceToday = await page.$eval(kristiansandSelector, (element) => {
        return element.textContent;
    })

    pricesList.push(osloPriceToday);
    pricesList.push(kristiansandPriceToday);
    console.log("scraped data",pricesList);
    //console.log("oslopris",value);
    await page.close();
    await browser.close();
    return pricesList;
}

getPrice();