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
      getChart(data)
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
            data: calcolovenditepermese(data)
        }]
    },

    // Configuration options go here
    options: {}
});
}
