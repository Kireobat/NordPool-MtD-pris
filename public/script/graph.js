// make a graph with the given data

// get data from spotpris.eu/data/data.json
// use this to get for current month ( needs to be adapted )

// halp me

let data = []

fetch('/data/data.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      currentDate = new Date();
      let currentMonthData = [];
      for (let i = 0; i < data.prisTabell.length; i++) {
        let itemDate = new Date(data.prisTabell[i].date);
        if (itemDate.getMonth() === currentDate.getMonth()) {
          currentMonthData.push(data.prisTabell[i]);
        }
      }
      console.log("Current month",currentMonthData);
});
