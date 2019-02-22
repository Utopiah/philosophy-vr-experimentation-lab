/* global generatePie */
let datapoints = [];

// define variables that reference elements on our page
const datapointsList = document.getElementById('datapoints');

fetch('/getDatapoints')
.then(function(response) { return response.json(); })
.then(function(datapoints) {
  var value1 = 0
  var value2 = 0
  // iterate through every datapoint and add it to our page
  datapoints.forEach( function(row) {
    appendNewDatapoint(row.datapoint);
    if (row.datapoint == "Left")
      value1++
    else
      value2++
  });
  
  generatePie(value1, value2) // from datapie.js
})

// a helper function that creates a list item for a given datapoint
const appendNewDatapoint = function(datapoint) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = datapoint;
  datapointsList.appendChild(newListItem);
}
