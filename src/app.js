// Imports

const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const exp = require('constants');
const fileStorage = require("./fileStorage")
const priceFetcher = require("./priceFetcher")


// Constants in ms
const second = 1000;
const minute = second * 60;
const hour = minute * 60;

// how often to update prices
const interval = 6*hour;

// Data

const data = fileStorage.loadData();

// Delay function

//delay
const delay = async (ms) => new Promise(res => setTimeout(res, ms));

// Fetch price

const fetchPrice = priceFetcher.main();

//fetchPrice.then((result) => { console.log("result", result)})

async function updatePrices(){
    while (true){
    await fetchPrice.then((result) => { console.log("result", result)})
    await delay(interval);
    }
}

// Create express app

const dataPath = path.join(__dirname, '../data');
const viewsPath = path.join(__dirname, '../views/pages');
const partialsPath = path.join(__dirname, '../views/pages/partials');
const publicPath = path.join(__dirname, '../public');
const port = 81;
const app = express();

// Setup handlebars engine and views location

app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

// Variables

// Functions

console.log("data test",data)

// Update prices

updatePrices();


// Routes

root = (req, res) => {
    res.render('index.hbs', {
        title: 'Home',
    });
}


app.get('/', root);

app.listen(port, () => {console.log("Server started on http://localhost:" + port)});
