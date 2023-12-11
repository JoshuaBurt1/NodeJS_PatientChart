//This is taking the values displayed on the client side in measurement column -> displayed via chart.js
//ALTERNATIVELY: this is done through obtaining the data from mongoDB
const values = document.querySelectorAll("#measurementData");

//creates an array of all data from measurement attribute of chart.js model (2,3,4, etc.)
var measuredDataSet = [];
for (let i = 0; i < values.length; i++) {
  const measuredData = values[i].textContent.split(',').map(Number);
  measuredDataSet.push(measuredData);
}
console.log(measuredDataSet);

//generates time stamps based on the longest measured data set for the longest data set (visit 1,2, etc.)
function generateTimestamps() {
  var maxLength=0;
  for (let i = 0; i < measuredDataSet.length; i++) {
    const dataLength = measuredDataSet[i].length;
    maxLength = Math.max(maxLength, dataLength);
  }
  console.log(maxLength);
  const timestamps = [];
  for (let j = 1; j <= maxLength; j++) {
    timestamps.push("Visit " + j);
  }
  return timestamps;
}

// Count instances {{this.measurement}} occurs
let measurementNum = 0;
document.querySelectorAll("#measurementData").forEach(function (element) {
  measurementNum++;
  const canvas = element.querySelector('canvas');
  //this creates a new canvas.id for every instance of {{this.measurement}}, this is necessary as only a single canvas can have the same id
  canvas.id = `myChart${measurementNum}`;
  //creates each canvas with respective id
  drawGraph(canvas, measuredDataSet[measurementNum - 1]);
});

function drawGraph(canvas, data) {
  const ctx = canvas.getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generateTimestamps(),
      datasets: [{
        label: 'Patient Data',
        data: data,
        backgroundColor: 'rgba(81, 180, 180, 0.2)',
        borderColor: 'rgba(81, 180, 180, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}