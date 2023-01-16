console.log("calculator.js has loaded");

openCalculatorBtn = document.getElementById("open-calculator");
closeCalculatorBtn = document.getElementById("close-calculator");
calculator = document.getElementById("calculator");

openCalculatorBtn.addEventListener("click", () => {
    console.log("open cal")
    calculator.style.display = "block";
});
closeCalculatorBtn.addEventListener("click", () => {
    console.log("close cal")
    calculator.style.display = "none";
});


let resultTxt = document.getElementById("result");
let inputTxt = document.getElementById("input");
const resultBtn = document.getElementById("resultBtn");

const nettleiePris = [125,200,325,450,575,700,1325,1950,2575,5150]


resultBtn.addEventListener("click", () => {
    let input = inputTxt.value
    
    switch (input) {
        case input in range(0,2):
            nettleie = nettleiePris[0]
            break;
        case input in range(2,5):
            nettleie = nettleiePris[1]
            break;
        case input in range(5,10):
            nettleie = nettleiePris[2]
            break;
        case input in range(10,15):
            nettleie = nettleiePris[3]
            break;
        case input in range(15,20):
            nettleie = nettleiePris[4]
            break;
        case input in range(20,25):
            nettleie = nettleiePris[5]
            break;
        case input in range(25,50):
            nettleie = nettleiePris[6]
            break;
        case input in range(50,75):
            nettleie = nettleiePris[7]
            break;
        case input in range(75,100):
            nettleie = nettleiePris[8]
            break;
        case input > 100:
            nettleie = nettleiePris[9]
            break;
        default:
            nettleie = "error"
            break;
    }

    console.log(nettleie)
    
    let result = input*100 + nettleie

    resultTxt.innerText = result
});