function init() {

    var buttonAdd = $('#addSale');

    moment.locale("it");
    getApiData();


    buttonAdd.click(function(){
      var x = $('#importo').val();
      x = Number(x);
      console.log("Controllo: " + $('#importo').val().length);

      if (isNaN(x) || x.length === 0) {
        alert("devi inserire un valore numerico");
        $('#importo').val("");
      }else{
        registerNewSale();
        $('#importo').val("");
      }

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
            label: "Volume D'affari",
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgba(00, 00, 00, 0.4)',
            data: calcolovenditepermese(data),

        }]
    },

    // Configuration options go here
    options: {
      title: {
        display: true,
        text: 'VENDITE TOTALI PER OGNI MESE',
        fontSize: 28,
        position: "left"
      },
      legend: {
        display: true,
        position: 'right',
      },
    }
});
}

function getChartTorta(data){

  var arrData = calcVendAnnualiPerAgente(data);

  var name = Object.keys(arrData);
  var amounts = Object.values(arrData);

  console.log("AMOUNTS pre PRERCENTUALI", amounts);

  var sumAmounts = 0;
  for (var i = 0; i < amounts.length; i++) {
    sumAmounts += Number(amounts[i]);
  }

  for (var i = 0; i < amounts.length; i++) {
    amounts[i] = ((amounts[i]/sumAmounts)*100).toFixed(2);

  }

  console.log("AMOUNTS POST PERCENTUALI ", amounts);

  console.log("NAME ", name);
  console.log("AMOUNTH", amounts);

  var ctx = document.getElementById('myChartTorta').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: name,
        datasets: [{

            backgroundColor: ['lightblue',
                              'lightgreen',
                              'lightpink',
                              'lightgrey',
                              'lightbrown',
                              'orange',
                              'blue',
                              'grey',
                              'green'],
            borderColor: 'rgba(255, 99, 132, 0.3)',
            data: amounts,

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
              position: 'right',
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

  var obj = getTotalSaleForQuarter(data);

  var quarterArr = Object.keys(obj);
  var amountForQuarterArr = Object.values(obj);

  var ctx = document.getElementById('myChartBar').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: quarterArr,
        datasets: [{
            // label: 'My First dataset',
            backgroundColor: ['lightblue',
                              'lightgreen',
                              'lightpink',
                              'grey',
                              ],
            borderColor: 'rgb(255, 99, 132)',
            data: amountForQuarterArr,

        }]

    },

    // Configuration options go here
    options: {

            responsive: true,
            maintainAspectRatio: true,
            // width: 200,
            legend: {
              display: true,
              position: 'left',
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
            },


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

  var sellers = {};

  for (var i = 0; i < data.length; i++) {
    var d = data[i];

    var name = d.salesman;
    var amount = Number(d.amount);

    if (!sellers[name]) {

      sellers[name] = 0;
    }

    sellers[name] += amount;
    // console.log("SELLERS: ", sellers);
  }
  console.log("SELLERS AMOUNT: ", sellers);
  return sellers

  }



function getTotalSaleForQuarter(data){

  var obj = {};
  var quarterStr = "";

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var amount = Number(d.amount);
    var date = moment(d.date, "DD-MM-YYY").month();

    if (!obj["Q1"]) {

      obj["Q1"] = 0;
    }if(!obj["Q2"]){

      obj["Q2"] = 0;
    }if(!obj["Q3"]){

      obj["Q3"] = 0;
    }if(!obj["Q4"]){

      obj["Q4"] = 0;
    }

    if (date >= 0 && date <=2) {
      obj["Q1"] += amount;
    }

    if (date >= 3 && date <=5) {
      obj["Q2"] += amount;
    }

    if (date >=6 && date <=8) {
      obj["Q3"] += amount;
    }
    if (date >=9 && date <=11){
      obj["Q4"] += amount;
    }

  }
  console.log("LOG DI OBJ:", obj);
  return obj
}



function registerNewSale(){

  $("#selectsalesman").val("");
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
