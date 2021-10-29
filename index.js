let headerDiv = document.createElement("div");
let h2 = document.createElement("h2");
h2.className = "header";
h2.innerHTML = "WORLDWIDE COVID 19 STATISTICS";
headerDiv.append(h2);
document.body.append(headerDiv);

let datePickerDiv = document.createElement("div");
let paragraph = document.createElement("p");
paragraph.innerHTML = "Date:";
paragraph.className = "input";
let inputDate = document.createElement("input");
inputDate.type = "text";
inputDate.className = "datepicker";
paragraph.append(inputDate);
datePickerDiv.append(paragraph);
document.body.append(datePickerDiv);

let tableDiv = document.createElement("div");
let table = document.createElement("table");
let heading = document.createElement("tr");
heading.className = "heading";
let th1 = document.createElement("th");
let th2 = document.createElement("th");
let th3 = document.createElement("th");
let th4 = document.createElement("th");
let th5 = document.createElement("th");
th1.innerHTML = "COUNTRY NAME";
th2.innerHTML = "CONFIRMED";
th3.innerHTML = "DEAD";
th4.innerHTML = "RECOVERED";
th5.innerHTML = "ACTIVE";
heading.append(th1);
heading.append(th2);
heading.append(th3);
heading.append(th4);
heading.append(th5);
table.append(heading);
tableDiv.append(table);
document.body.append(tableDiv);

function formatDate(date) {
  return date
    .split("/")
    .map((item) => (item[0] === "0" ? item.slice(1) : item))
    .join("-");
}

async function requestDate() {
  let result = await fetch("https://covid19.mathdro.id/api/countries").then(
    (response) => response.json()
  );

  let countries = result.countries.map((item) => item.name);

  countries.forEach((country) => {
    let column = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    td1.innerHTML = country;
    td2.innerHTML = "";
    td3.innerHTML = "";
    td4.innerHTML = "";
    td5.innerHTML = "";
    td1.className = "updatedName";
    td2.className = "updatedConfirmed";
    td3.className = "updatedDead";
    td4.className = "updatedRecovered";
    td5.className = "updatedActive";
    column.append(td1);
    column.append(td2);
    column.append(td3);
    column.append(td4);
    column.append(td5);
    table.append(column);
  });
}

async function dailyUpdate(selectedDate = "") {
  $(".datepicker").on("change", function () {
    if ($(this).val() !== null) {
      selectedDate = formatDate($(this).val());
      dailyUpdate(selectedDate);
    }
  });

  let url = `https://covid19.mathdro.id/api/daily/${selectedDate}`;

  try {
    let result = await fetch(url).then((response) => response.json());

    let countries = Array.from(
      new Set(result.map((item) => item.countryRegion))
    );

    if (!countries[0]) {
      requestDate();
    } else {
      let countriesDate = [];
      countries.forEach((country) => {
        let date = {};
        let confirmed = result.reduce(
          (sum, item) =>
            item.countryRegion === country ? (sum += +item.confirmed) : sum,
          0
        );
        let dead = result.reduce(
          (sum, item) =>
            item.countryRegion === country ? (sum += +item.deaths) : sum,
          0
        );
        let recovered = result.reduce(
          (sum, item) =>
            item.countryRegion === country ? (sum += +item.recovered) : sum,
          0
        );
        let active = result.reduce(
          (sum, item) =>
            item.countryRegion === country ? (sum += +item.active) : sum,
          0
        );
        date.name = country;
        date.confirmed = confirmed;
        date.dead = dead;
        date.recovered = recovered;
        date.active = active;
        countriesDate.push(date);
      });

      for (let i = 1; i < table.children.length; i++) {
        let tr = table.children[i];
        let td1 = tr.firstElementChild;
        let td2 = td1.nextElementSibling;
        let td3 = td2.nextElementSibling;
        let td4 = td3.nextElementSibling;
        let td5 = td4.nextElementSibling;
        countriesDate.forEach((country) => {
          if (country.name === td1.innerHTML) {
            td2.innerHTML = country.confirmed;
            td3.innerHTML = country.dead;
            td4.innerHTML = country.recovered;
            td5.innerHTML = country.active;
          }
        });
      }
    }
  } catch (err) {
    alert(err.message);
  }
}

dailyUpdate();
