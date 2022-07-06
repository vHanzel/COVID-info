var baza = 'vHanzel';
var baseUrl = 'https://teaching.lavbic.net/api/OIS/baza/' + baza + '/podatki/';


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */

 window.addEventListener("load", function(){
    document.getElementById("genPodatkov_btn").onclick = function () {
      izprazniDb(function() {
        for (let i = 1; i <= 3; i++) {
          generirajPodatke(i);
        }
        window.location.reload();
      });
      
      
    };
    getAllPatients();
    getRegions();
    
});




function generirajPodatke(stPacienta) {
    let pacient;
    //console.log("ID: " + generirajID());
      if(stPacienta == 1) {
        pacient = {
          ehrID: generirajID(),
          ime: "Janez",
          priimek: "Novak",
          spol: "M",
          starost: 33,
          telesnaTemperatura: 37,
          teza: 85,
          visina: 178,
          sportnoAktiven: true,
          bolezni: [
            "prehlad"
          ],
        }
      } else if(stPacienta == 2) {
        pacient = {
          ehrID: generirajID(),
          ime: "Joža",
          priimek: "Avsenik",
          spol: "M",
          starost: 78,
          telesnaTemperatura: 41,
          teza: 75,
          visina: 174,
          sportnoAktiven: false,
          bolezni: [
            "Astma",
            "Sladkorna Bolezen",
            "Covid-19"
          ],
        };
      } else if(stPacienta == 3) {
        pacient = {
          ehrID: generirajID(),
          ime: "Marija",
          priimek: "Novak",
          spol:"Ž",
          starost: 45,
          teza: 55,
          visina: 165,
          telesnaTemperatura: 36,
          sportnoAktiven: false,
          bolezni: [
            "Astma",
          ],
        };
      }
      addPatient2db(pacient);
     
	}
function izprazniDb(callback) {
  $.ajax({
    url: "https://teaching.lavbic.net/api/OIS/baza/vHanzel/podatki/brisi",
    type: "DELETE",
    success: function(odgovor) {
      console.log("Podatki izbrisani");
      callback();
    },
    error: function(napaka) {
      console.log(napaka);
    },
  });

}
function addPatient2db(pacient) {
    $.ajax({
      url: baseUrl + "azuriraj?kljuc=" + pacient.ehrID,
      type: "PUT",
      data: JSON.stringify(pacient),
      contentType: 'application/json',
      success: function (odgovor) {
        console.log("Pacienti uspešno dodani");
      },
      error: function (napaka) {
        console.log("Napaka pri generiranju podatkov!")
      } 

    });
  
}

function getAllPatients() {
  let uporabnikiSelect = document.getElementById("izbiraUporabnika");
  
    $.ajax({
      url: baseUrl + "/vrni/vsi",
      type: "GET",
      success: function(odgovor) {
        
        for (let key in odgovor) {
          let select = document.createElement("option");
          let pacient = odgovor[key];
          console.log(pacient);
          select.innerHTML = pacient.ime + " " + pacient.priimek
          select.value = pacient.ehrID;
          uporabnikiSelect.appendChild(select);
        }
        console.log("Uspesno pridobljeni podatki o pacientih");
      },
      error: function(napaka) {
        console.log("Prislo je do napake pri pridobivanju pacientov iz podatkovne baze");
      }
      

    });
}
function izracunBMI(teza, visina) {
  return ((teza/(visina*visina))*10000).toFixed(1);
}

function izberiUporabnika() {
  let uporabnikiSelect = document.getElementById("izbiraUporabnika");
  let ehrID = uporabnikiSelect.options[uporabnikiSelect.selectedIndex].value; // get selected option value
  if (ehrID) {
    $.ajax({
      url: baseUrl + "/vrni/" + ehrID,
      type: "GET",
      success: function(odgovor) {
      //let pacient = odgovor[ehrID];
      console.log(odgovor);
      document.getElementById("ime").innerHTML = "<b>"+ "Ime: " + "</b>" + odgovor.ime;
      document.getElementById("priimek").innerHTML = "<b>"+ "Priimek: "  + "</b>" + odgovor.priimek;
      document.getElementById("spol").innerHTML = "<b>"+ "Spol: "  + "</b>" + odgovor.spol;
      document.getElementById("starost").innerHTML = "<b>"+ "Starost: "  + "</b>" + odgovor.starost;
      document.getElementById("teza").innerHTML = "<b>"+ "Teza: "  + "</b>" + odgovor.teza + " kg";
      document.getElementById("visina").innerHTML = "<b>"+ "Visina: "  + "</b>" + odgovor.visina + " cm";
      document.getElementById("telesnaTemperatura").innerHTML = "<b>"+ "Telesna Temperatura: "  + "</b>" + odgovor.telesnaTemperatura;
      document.getElementById("sportnoAktiven").innerHTML = "<b>"+ "Sportno Aktiven: "  + "</b>" + (odgovor.sportnoAktiven ? "Da" : "Ne");
      document.getElementById("bolezni").innerHTML = "<b>"+ "Bolezni: "  + "</b>" + odgovor.bolezni;
      document.getElementById("BMI").innerHTML = "<b>"+ "BMI: "  + "</b>" + izracunBMI(odgovor.teza, odgovor.visina);

        
      },
      error: function(napaka) {
        console.log("Prislo je do napake pri pridobivanju pacienta iz podatkovne baze");
      }
      

    });
  } else {
    alert("Izberite pacienta na seznamu");
  }
}

function izpisBMI() {
  document.getElementById("izracunanBMI");
  let teza = document.getElementById("vnesiTezo").value;
  let visina = document.getElementById("vnesiVisino").value;
  if (teza <= 0 || visina <= 0) {
    alert("Preverite vnešene podatke");
  } else {
    
    let bmi = izracunBMI(teza, visina);
    if (bmi >= 25) {
      document.getElementById("izracunanBMI").innerHTML = "Vaš BMI je " + "<b>"+  bmi + "</b>"+  ", kar pomeni da je pri vas večja verjetnost za hujši potek COVID-19." + "<br>"
      + " Predlagamo vam da se izogibate regijam z višjim številom aktivnih primerov.";
    } else if (bmi <= 18) {
      document.getElementById("izracunanBMI").innerHTML = "Vaš BMI je " + "<b>"+  bmi + "</b>"+  ", kar pomeni da je pri vas večja verjetnost za hujši potek COVID-19." + "<br>"
      + " Predlagamo vam da se izogibate regijam z višjim številom aktivnih primerov.";

    } else {
      document.getElementById("izracunanBMI").innerHTML = "Vaš BMI je " + "<b>"+  bmi + "</b>"+  ", kar je zdravo, zato nimate večje verjetnosti za hujši potek COVID-19. ";
    }
  }
  
}
function getRegions(callback) {

  Papa.parse("https://raw.githubusercontent.com/sledilnik/data/master/csv/region-active.csv", {
	download: true,
	complete: function(results) {
    let length = results.data.length;
    let chart = document.getElementById("myChart");
		//console.log(results.data[length - 2]);
    buildChart(results.data[length - 2]);
	}
});

}


function buildChart(podatki) {
  var ctx = document.getElementById('myChart').getContext('2d');
  //console.log(podatki);
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['CE', 'KK', 'KP', 'KR', 'LJ', 'MB', "MS", "NG", "NM", "PO", "SG"],
          datasets: [{
              label: 'Aktivni primeri',
              data: [podatki[1], podatki[3], podatki[4], podatki[5], podatki[6], podatki[7], podatki[8] ,podatki[9] ,podatki[10] ,podatki[11], podatki[12]],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
              ],
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
  return myChart;
}

function vnesiteUporabnika() {
  let ehrID = document.getElementById("ehrID").value;
  console.log(ehrID);
  if (ehrID) {
    $.ajax({
      url: baseUrl + "/vrni/" + ehrID,
      type: "GET",
      success: function(odgovor) {
      //let pacient = odgovor[ehrID];
      document.getElementById("ime").innerHTML = "<b>"+ "Ime: " + "</b>" + odgovor.ime;
      document.getElementById("priimek").innerHTML = "<b>"+ "Priimek: "  + "</b>" + odgovor.priimek;
      document.getElementById("spol").innerHTML = "<b>"+ "Spol: "  + "</b>" + odgovor.spol;
      document.getElementById("starost").innerHTML = "<b>"+ "Starost: "  + "</b>" + odgovor.starost;
      document.getElementById("teza").innerHTML = "<b>"+ "Teza: "  + "</b>" + odgovor.teza + " kg";
      document.getElementById("visina").innerHTML = "<b>"+ "Visina: "  + "</b>" + odgovor.visina + " cm";
      document.getElementById("telesnaTemperatura").innerHTML = "<b>"+ "Telesna Temperatura: "  + "</b>" + odgovor.telesnaTemperatura;
      document.getElementById("sportnoAktiven").innerHTML = "<b>"+ "Sportno Aktiven: "  + "</b>" + (odgovor.sportnoAktiven ? "Da" : "Ne");
      document.getElementById("bolezni").innerHTML = "<b>"+ "Bolezni: "  + "</b>" + odgovor.bolezni;
      document.getElementById("BMI").innerHTML = "<b>"+ "BMI: "  + "</b>" + izracunBMI(odgovor.teza, odgovor.visina);
        
      },
      error: function(napaka) {
        alert("EhrID ni v bazi");
      }
      

    });
  } else {
    alert("EhrID ni v bazi");
  }
}
 


function generirajID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
