function init() {
    console.log("Hello World");
    getApiData();
}

$(document).ready(init);


function getApiData (){

  $.ajax({

    url: "http://157.230.17.132:4003/sales",
    method: "GET",

    success: function(data){
      console.log(data);
      getChart(data);
      getChartTorta(data)
    },
    error: function(){
      alert("Errore caricamento dati api")
    }
  });
}



function getMonth(){

  var months = moment.months();

  return months
}



function calcolovenditepermese(data){

  var arrmonthvendite = new Array(12).fill(0);

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var amount = Number(d.amount);
    var month = moment(d.date, "DD-MM-YYYY").month();

    arrmonthvendite[month] += amount;
  }
  console.log(arrmonthvendite);
  return arrmonthvendite
}


function getChart(data){
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: getMonth(),
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: calcolovenditepermese(data),

        }]
    },

    // Configuration options go here
    options: {}
});
}

function getChartTorta(data){
  var ctx = document.getElementById('myChartTorta').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: getsalesman(data),
        datasets: [{
            label: 'My First dataset',
            backgroundColor: ['rgb(255, 99, 132)',
                              'rgb(255, 88, 547)',
                              'yellow',
                              'lightblue',
                              'lightgreen',
                              'lightpink',
                              'lightgrey',
                              'lightbrown',
                              'orange',
                              'blue',
                              'grey',
                              'green'],
            borderColor: 'rgb(255, 99, 132)',
            data: calcVendAnnualiPerAgente(data),



        }]
    },

    // Configuration options go here
    options: {}
});
}

function getsalesman(data){

  var arrsalesman = [];

  for (var i = 0; i < data.length; i++) {
    var d = data[i];

    if (!arrsalesman.includes(d.salesman)) {
        arrsalesman.push(d.salesman);
    }

  }

  console.log("arrsalesman: ", arrsalesman);
  return arrsalesman
}


function calcVendAnnualiPerAgente(data){

  var salesmans = getsalesman(data);
  var arrforChart = [];
  var obj = {};

  // console.log("salesman in funzione esterna", salesman);

  for (var i = 0; i < salesmans.length; i++) {

    console.log("SALESMANS");
    console.log(salesmans);
    console.log(salesmans.length);
    console.log("CIaooooo");
    obj = {
      salesman: "",
      amountofyear: ""
    };
    var contovendite = 0;
    var salesMan = salesmans[i];

    obj.salesman = salesMan;

    console.log("salesman esterno:", salesMan);

    for (var j = 0; j < data.length; j++) {
      var d = data[j];

      if (d.salesman === salesMan) {

        contovendite += d.amount;
      }

    }
    obj.amountofyear = contovendite
    arrforChart.push(obj);
    console.log("OBJ:", arrforChart);
  }

  return arrforChart;
  }
