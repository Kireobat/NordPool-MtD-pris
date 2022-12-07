const fs = require("fs")
const path = require("path")

/**
 * Funksjon for å lagra data til fil. Data vil lagres i JSON-formatet
 * @param {*} data Data som skal lagres. Valgfri datatype 
 * @param {*} dataFilePath Lagringssted. Som standard blir den lagret til ./data/data.json
 */

let storeData = function (data, dataFilePath = path.join(__dirname, "../data/data.json")) {
    //Først gjør vi dataen om til tekst, etter Json standarden
    const dataInJsonFormat = JSON.stringify(data)
    fs.writeFileSync(dataFilePath, dataInJsonFormat)
    console.log("Lagret følgende data: " + dataInJsonFormat)
}

/**
 * 
 * @param {*} dataFilePath Data som skal hentes. Som standard hentes ./data/data.json
 * @returns 
 */

let loadData = function(dataFilePath = path.join(__dirname, "../data/data.json")) {
    const dataInJsonFormat = fs.readFileSync(dataFilePath, "utf-8")
    const data = JSON.parse(dataInJsonFormat)
    console.log("Hentet følgende data: " + data)
    return data
}

exports.storeData = storeData
exports.loadData = loadData