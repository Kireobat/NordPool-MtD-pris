// Imports

const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const exp = require('constants');
const fileStorage = require("./fileStorage")
const priceFetcher = require("./priceFetcher")


// Data

const data = fileStorage.loadData();

//

const fetchPrice = priceFetcher.main();

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
console.log("fetchPrice test",fetchPrice)

// Routes

root = (req, res) => {
    res.render('index.hbs', {
        title: 'Home',
    });
}


app.get('/', root);

app.listen(port, () => {console.log("Server started on http://localhost:" + port)});
