function init() {

    var buttonAdd = $('#addSale');
    getApiData();

    buttonAdd.click(function(){
      registerNewSale();

    });
}

$(document).ready(init);


function getApiData (){

  $.ajax({

    url: "http://157.230.17.132:4003/sales",
    method: "GET",

    success: function(data){
      console.log(data);

      if ($('#selectsalesman').empty() && $('#selectmonth').empty()) {
        templateAddSales(getsalesman(data), getMonth());
      }

      getChart(data);
      getChartTorta(data);
      getGraphBar(data);
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

function templateAddSales(arrSalesman, arrMonth){

  var source = $('#option-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrSalesman.length; i++) {
    var salesMan = arrSalesman[i];

    var context = {
      option: salesMan
    };
    var html = template(context);

      $('#selectsalesman').append(html);
  }

  for (var j = 0; j < arrMonth.length; j++) {
    var month = arrMonth[j];

    var context = {
      option: month
    };
    var html = template(context);
    // $('#selectmonth').child().remove();

      $('#selectmonth').append(html);
  }
}


function calcolovenditepermese(data){

  var arrmonthvendite = new Array(12).fill(0);

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var amount = parseInt(d.amount);
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
    options: {
      title: {
        display: true,
        text: 'VENDITE TOTALI PER OGNI MESE',
        fontSize: 28,
        position: "right"
      },
    }
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
    options: {

            // rotation: -Math.PI,
            cutoutPercentage: 30,
            // circumference: Math.PI,
            legend: {
              display: true,
              position: 'right',
            },
            title: {
              display: true,
              text: 'VENDITE TOTALI PER OGNI VENDITORE SU BASE ANNUA',
              position: 'left',
              fontSize: 28,
            },
            animation: {
              animateRotate: true,
              animateScale: true
            }
          }

});
}

function getGraphBar(data){

  var ctx = document.getElementById('myChartBar').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: getQuarter(data),
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
            data: getTotalSaleForQuarter(data),

        }]

    },

    // Configuration options go here
    options: {

            // rotation: -Math.PI,
            cutoutPercentage: 30,
            // circumference: Math.PI,
            legend: {
              display: true,
              position: 'right',
            },
            title: {
              display: true,
              text: 'VENDITE PER QUARTER',
              position: 'left',
              fontSize: 28,
            },
            animation: {
              animateRotate: true,
              animateScale: true
            }
          }

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
  var arrTotAmount = new Array(salesmans.length).fill(0);
  var fatTotale = 0;

  // console.log("salesman in funzione esterna", salesman);

  for (var i = 0; i < salesmans.length; i++) {


    var salesMan = salesmans[i];

    console.log("salesman esterno:", salesMan);

    for (var j = 0; j < data.length; j++) {
      var d = data[j];

      if (d.salesman === salesMan) {

        arrTotAmount[i] += parseInt(d.amount);
      }

      fatTotale += parseInt(d.amount);
    }

    arrTotAmount[i] = Math.ceil((arrTotAmount[i] * 100) / fatTotale) * 2;
    console.log("OBJ:", arrTotAmount);
  }
  console.log("FATTURATO TOTALE");
  console.log(fatTotale);
  return arrTotAmount;
  }



function getQuarter(){

  var arrQuarter= [];
 var arrMonth = getMonth();
 var arrMonthLenght = arrMonth.length ;
 var quarter = arrMonthLenght/3;

 console.log("lunghezza array mesi: ", arrMonthLenght);
 for (var i = 1; i <= quarter; i++) {
   arrQuarter.push("Q" + i)
 }
 console.log("ARR QUARTER: ", arrQuarter);
 return arrQuarter
}


function getTotalSaleForQuarter(data){

  var arrQuarter = getQuarter();
  var arrTotQuarter = new Array(arrQuarter.length).fill(0);

  console.log("ARRAY INIZIALIZZATO A ZERO PER SOMMA QUORTER: ", arrTotQuarter);

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var extractMonth = moment(d.date, "DD-MM-YYYY").month();
    if (extractMonth >= 0 && extractMonth <=2) {
      arrTotQuarter[0] += parseInt(d.amount);
    }else if (extractMonth >= 3 && extractMonth <=5){
      arrTotQuarter[1] += parseInt(d.amount);
    }else if (extractMonth >= 6 && extractMonth <=8){
      arrTotQuarter[2] += parseInt(d.amount);
    }else{
      arrTotQuarter[3] += parseInt(d.amount);
    }
    console.log("LOG PER OGNI DATA ",extractMonth);
    console.log("ARR TOT QUARTER: ", arrTotQuarter);
  }
  return arrTotQuarter
}


function registerNewSale(){

  var salesName = $('select#selectsalesman').find(":selected").text();
  var salesValue = parseInt($('input[type=text][name=valsales]').val());

  console.log("VAOLORE INPUT AMOUNT: ", salesValue );

  var month = $('select#selectmonth').find(":selected").text();

  $.ajax({
    url: "http://157.230.17.132:4003/sales",
    method: "POST",

    data: {
      salesman: salesName,
      amount: Number(salesValue),
      // date: "15-"+month+"-2017"
      date: "01/"+monthToNumber(month)+"/2017"
    },
    success: function(){

      getApiData();
    },
    error: function(){
      alert('Errore chiamata Post')
    }
  });

}

function monthToNumber(nameMonth){

  var arrMontName = getMonth();

  for (var i = 0; i < arrMontName.length; i++) {
    var name = arrMontName[i]

    if (name === nameMonth) {

      var numberToMonth = i+1;
      var strnamemonth = numberToMonth.toString();
      console.log("numberToMonth.length", strnamemonth.length);
      if (strnamemonth.length === 1) {
        strnamemonth = "0" + strnamemonth
      }

      return strnamemonth
    }
  }
}
