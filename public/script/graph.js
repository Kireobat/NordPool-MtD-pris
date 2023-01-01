// make a graph with the given data

// get data from spotpris.eu/data/data.json
// use this to get for current month ( needs to be adapted )

let currentMonthData = [];
    for (let i = 0; i < data.prisTabell.length; i++) {
      let itemDate = new Date(data.prisTabell[i].date);
      if (itemDate.getMonth() === currentDate.getMonth()) {
        currentMonthData.push(data.prisTabell[i]);
      }
    }

    console.log("Current month",currentMonthData);

// halp me
