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

let currentDate = new Date();

// current date
today = currentDate;

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

    today = currentDate;
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

    // get increase since last month

    getIncrease();

    await delay(interval);
    }
}

// Get increase since last month

getIncrease = () => {
    let currentDate = new Date();
    console.log(currentDate);
    let previousMonth = new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth()-1, 
      currentDate.getDate() -1
      );
    console.log(previousMonth);

    let previousMonthData = [];
    for (let i = 0; i < data.prisTabell.length; i++) {
      let itemDate = new Date(data.prisTabell[i].date);
      if (itemDate.getMonth() === previousMonth.getMonth()) {
        previousMonthData.push(data.prisTabell[i]);
      }
    }

    console.log(previousMonthData);

    let previousAverageOslo = 0;
    let previousAverageKristiansand = 0;
    let previousAverageBergen = 0;
    let previousAverageMolde = 0;
    let previousAverageTrondheim = 0;
    let previousAverageTromso = 0;

    for (i=0; i < previousMonthData.length; i++) {
      previousAverageOslo += previousMonthData[i].oslo;
      previousAverageKristiansand += previousMonthData[i].kristiansand;
      previousAverageBergen += previousMonthData[i].bergen;
      previousAverageMolde += previousMonthData[i].molde;
      previousAverageTrondheim += previousMonthData[i].trondheim;
      previousAverageTromso += previousMonthData[i].tromso;
    }
    previousAverageOslo = Math.round(((previousAverageOslo * mva) / previousMonthData.length) *100) / 100;
    previousAverageKristiansand = Math.round(((previousAverageKristiansand * mva) / previousMonthData.length) *100) / 100;
    previousAverageBergen = Math.round(((previousAverageBergen * mva) / previousMonthData.length) *100) /100;
    previousAverageMolde = Math.round(((previousAverageMolde * mva) / previousMonthData.length) *100) /100;
    previousAverageTrondheim = Math.round(((previousAverageTrondheim * mva) / previousMonthData.length) *100) /100;
    previousAverageTromso = Math.round(((previousAverageTromso * mva) / previousMonthData.length) *100) /100;

    console.log("Previous average Oslo: " + previousAverageOslo);
    console.log("average Oslo: " + averageOslo);

    increaseOslo = Math.round(((averageOslo - previousAverageOslo) / previousAverageOslo) * 100);
    increaseKristiansand = Math.round(((averageKristiansand - previousAverageKristiansand) / previousAverageKristiansand) * 100);
    increaseBergen = Math.round(((averageBergen - previousAverageBergen) / previousAverageBergen) * 100);
    increaseMolde = Math.round(((averageMolde - previousAverageMolde) / previousAverageMolde) * 100);
    increaseTrondheim = Math.round(((averageTrondheim - previousAverageTrondheim) / previousAverageTrondheim) * 100);
    increaseTromso = Math.round(((averageTromso - previousAverageTromso) / previousAverageTromso) * 100);
  
    console.log("Increase Oslo: " + increaseOslo);
    console.log("Increase Kristiansand: " + increaseKristiansand);
    console.log("Increase Bergen: " + increaseBergen);
    console.log("Increase Molde: " + increaseMolde);
    console.log("Increase Trondheim: " + increaseTrondheim);
    console.log("Increase Tromso: " + increaseTromso);
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

// Update prices (comment out when testing)

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
        lastMonth: 'november',
        spotpris: averageBergen,
        okning: increaseBergen,
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
