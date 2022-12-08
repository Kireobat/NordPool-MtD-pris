// Imports

const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fileStorage = require("./fileStorage")
const priceFetcher = require("./priceFetcher")


// Constants in ms
const second = 1000;
const minute = second * 60;
const hour = minute * 60;

// how often to update prices
const interval = 24*hour;

// Data

const data = fileStorage.loadData();

// Get date

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

// current date
today = dd + '/' + mm + '/' + yyyy;

// test date
console.log(today);

//delay
const delay = async (ms) => new Promise(res => setTimeout(res, ms));

// Fetch price

const fetchPrice = priceFetcher.main();

async function updatePricesAndWriteToJSON(){
    while (true){
    await fetchPrice.then((result) => { 
        console.log("result", result)

        let dataToWrite = {
            "date": today,
            "oslo": result[0],
            "kristiansand": result[1],
            "bergen": result[2],
            "molde": result[3],
            "trondheim": result[4],
            "tromso": result[5]
        }
        data.prisTabell.push(dataToWrite)
        fileStorage.storeData(data)
    })
    console.log("Data stored");

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

// Update prices

updatePricesAndWriteToJSON();


// Routes

root = (req, res) => {
    res.render('index.hbs', {
        title: 'Spotpris.eu',
    });
}


app.get('/', root);

app.listen(port, () => {console.log("Server started on http://localhost:" + port)});
