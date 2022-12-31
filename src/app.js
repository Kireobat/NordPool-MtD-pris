// Imports

const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fileStorage = require("./fileStorage")
const priceFetcher = require("./priceFetcher")


// medverdiavgift

let mva = 1.25;

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

let averageOslo = 0;
let averageKristiansand = 0;
let averageBergen = 0;
let averageMolde = 0;
let averageTrondheim = 0;
let averageTromso = 0;


async function updatePricesAndWriteToJSON(){
    while (true){

    today = dd + '/' + mm + '/' + yyyy;
    console.log(" Date: " + today);
    console.log("Interval: " + interval + "ms")

    // Calling priceFetcher.main() to fetch prices
    console.log("Fetching prices");
    
    // fetchPrice is the result from priceFetcher.main()
    const fetchPrice = priceFetcher.main();

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

    // calculate average prices

    for (let i = 0; i < data.prisTabell.length; i++) {
        averageOslo += data.prisTabell[i].oslo;
        averageKristiansand += data.prisTabell[i].kristiansand;
        averageBergen += data.prisTabell[i].bergen;
        averageMolde += data.prisTabell[i].molde;
        averageTrondheim += data.prisTabell[i].trondheim;
        averageTromso += data.prisTabell[i].tromso;
    }
    averageOslo = Math.round(((averageOslo * mva) / data.prisTabell.length) *100) / 100;
    averageKristiansand = Math.round(((averageKristiansand * mva) / data.prisTabell.length) *100) / 100;
    averageBergen = Math.round(((averageBergen * mva) / data.prisTabell.length) *100) /100;
    averageMolde = Math.round(((averageMolde * mva) / data.prisTabell.length) *100) /100;
    averageTrondheim = Math.round(((averageTrondheim * mva) / data.prisTabell.length) *100) /100;
    averageTromso = Math.round(((averageTromso * mva) / data.prisTabell.length) *100) /100;
    
    console.log("Average Oslo: " + averageOslo);
    console.log("Average Kristiansand: " + averageKristiansand);
    console.log("Average Bergen: " + averageBergen);
    console.log("Average Molde: " + averageMolde);
    console.log("Average Trondheim: " + averageTrondheim);
    console.log("Average Tromso: " + averageTromso);

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
    res.render('newIndex.hbs', {
        title: 'Spotpris.eu',
    });
}
city = (req, res) => {
    res.render('cityPrice.hbs', {
        title: 'Spotpris.eu | Bergen',
        city: 'Bergen',
        spotpris: averageBergen,
        okning: '13,8%',
    });
}


app.get('/', root);
app.get('/city', city);

// makes data available @ /data/data.json to client

app.get('/data/data.json', function (req, res) {
    fs.readFile(path.join(__dirname, 'public', 'data', req.params.filename), function (err, data) {
      if (err) {
        res.status(500).send('Error reading file');
      } else {
        res.send(data);
      }
    });
  });

app.listen(port, () => {console.log("Server started on http://localhost:" + port)});
