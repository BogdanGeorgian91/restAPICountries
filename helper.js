// getJSON HELPER FUNCTION
const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

// FORMATTING POPULATION NUMBER.
function commafy(num) {
  let str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
}
// ########## END FORMATTING POPULATION NUMBER #################

// #################################################################################
// ###############################################################################
// ###### DISPLAY COUNTRY NAME BASED ON ALPHA CODE. ####################

const getCode = async function (code) {
  const res = await fetch("https://restcountries.com/v2/all");
  const data = await res.json();
  const filteredArr = data.filter(
    (el) => el.alpha3Code.toLowerCase() === code.toLowerCase()
  );
  return filteredArr[0].name;
};

// ############ END DISPLAY COUNTRY NAME BASED ON ALPHA CODE. ##################
// #####################################################################################
// #######################################################################################

// #################################################################################
// ###############################################################################
// ###### CONSTRUCT SINGLE COUNTRY CARD COMPONENT WITH DATA FROM API. ####################

const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data) {
  const html = `
  <article class="country" id = "${data.name}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>Population:</span>${commafy(
            data.population
          )}</p>
          <p class="country__row"><span>Language:</span>${
            data.languages[0].name
          }</p>
          <p class="country__row"><span>Capital:</span>${
            data.capital ? `${data.capital}` : "Doesn't have capital!"
          }</p>
      </div>
  </article>
`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};
// ############ END CONSTRUCT SINGLE COUNTRY CARD COMPONENT WITH DATA FROM API. ###############
// #####################################################################################
// #######################################################################################

// #################################################################################
// ###############################################################################
// ###### CONSTRUCT COUNTRY COMPONENT EXPANDED VERSION. ####################

// ############# CONSTRUCTING BUTTONS FOR NEIGHBOURS. ######################
const backBtnFunctionality = function () {
  let backBtn = document.createElement("button");
  backBtn.classList.add(
    "country-highlight-button",
    "country-highlight-button-back"
  );
  const btnTextNode = document.createTextNode("Back");
  backBtn.appendChild(btnTextNode);
  return backBtn.outerHTML;
};

const searchComponent = document.querySelector(".search-country");

const btnNeighbour = async function (data) {
  const neighboursArr = [];
  let neighBtn;
  let neighbBtns;

  if (!data.borders) {
    neighbBtns = document.createElement("div");
    neighbBtns.classList.add("country__neighbours-btns");
    return (neighbBtns.innerHTML = "There are no neighbours!");
  }

  if (data.borders) {
    for (let i = 0; i < data.borders.length; i++) {
      neighbBtns = document.createElement("div");
      neighbBtns.classList.add("country__neighbours-btns");

      let txt = await getCode(data.borders[i]);
      let textNode = document.createTextNode(txt);
      neighBtn = document.createElement("button");
      neighBtn.classList.add("country-highlight-button", "neighbour");
      neighBtn.appendChild(textNode);
      neighboursArr.push(neighBtn);

      for (let j = 0; j < neighboursArr.length; j++) {
        neighbBtns.appendChild(neighboursArr[j]);
      }
    }
  }
  return neighbBtns.innerHTML;
};
// ############# END CONSTRUCTING BUTTONS FOR NEIGHBOURS. ######################

// ###### CONSTRUCT SINGLE COUNTRY EXPANDED COMPONENT WITH DATA FROM API. ####################
const renderCountryHighlight = async function (data) {
  const html = `
        <article class="country-highlight">
            
            ${backBtnFunctionality()}

            <div class="country-highlight-container">
                <img class="country__flag" src="${data.flag}" />

                <div class="country-highlight-container-right">
                    <div class="country__highlight-data">

                          <h3 class="country__name-h">${data.name}</h3>

                          <div class="country__highlight-data-content">
                              <p class="country__row-h country__native-name"><span>Native Name:</span>${
                                data.nativeName
                              }</p>
                              <p class="country__row-h"><span>Population:</span>${commafy(
                                data.population
                              )}</p>
                              <p class="country__row-h"><span>Region:</span>${
                                data.region
                              }</p>
                              <p class="country__row-h country__subregion"><span>Sub Region:</span>${
                                data.subregion
                              }</p>
                              <p class="country__row-h country__capital"><span>Capital:</span>${
                                data.capital
                                  ? `${data.capital}`
                                  : "Doesn't have capital!"
                              }</p>
                              <p class="country__row-h country__domain"><span>Top Level Domain:</span>${
                                data.topLevelDomain
                              }</p>
                              <p class="country__row-h country__currency"><span>Currencies:</span>${
                                data.currencies[0].name
                              }</p>
                              <p class="country__row-h"><span>Language:</span>${
                                data.languages[0].name
                              }</p>
                          </div>
                    </div>

                    <div class="country__neighbours">
                      <p class="country__row-h"><span>Border Countries:</span></p>

                      ${await btnNeighbour(data)}

                    </div>
                </div>
            </div>
        </article>
        `;

  searchComponent.classList.add("search-country-disabled");
  // countriesContainer.innerHTML = "";
  countriesContainer.insertAdjacentHTML("beforeend", html);
  // countriesContainer.style.display = "block";
  countriesContainer.style.opacity = 1;

  document
    .querySelector(".country-highlight-button-back")
    .addEventListener("click", function () {
      searchComponent.classList.remove("search-country-disabled");
      countriesContainer.innerHTML = "";
      getCountries();
    });

  document.querySelectorAll(".neighbour").forEach((el) =>
    el.addEventListener("click", function () {
      console.log("ok");
      searchComponent.classList.add("search-country-disabled");
      countriesContainer.innerHTML = "";
      searchComponent.classList.remove("search-country-disabled");
      getCountryDataHighlight(el.textContent);
    })
  );
};

// renderCountryHighlight("albania");

//  SHOWING EXPANDED COUNTRY
function showExpandedCountry() {
  const countryHighlight = document.querySelectorAll(".country");
  let countryToHighlight;

  countryHighlight.forEach((el) =>
    el.addEventListener("click", function (e) {
      searchComponent.classList.add("search-country-disabled");
      countriesContainer.innerHTML = "";
      countryToHighlight = el.id.toLowerCase();
      getCountryDataHighlight(countryToHighlight);
    })
  );
}
// ######## END CONSTRUCT SINGLE COUNTRY EXPANDED COMPONENT WITH DATA FROM API. ####################

// ############ END CONSTRUCT COUNTRY COMPONENT EXPANDED VERSION. ##################
// #####################################################################################
// #######################################################################################

// #################################################################################
// ###############################################################################
// ###### RENDERING ONLY THE SEARCHED COUNTRY ON PAGE. ####################

const getCountryDataCard = async function (country) {
  const res = await fetch(`https://restcountries.com/v2/name/${country}`);
  const data = await res.json();
  // console.log(data);
  return renderCountry(data[0]);
};

const getCountryDataHighlight = async function (country) {
  const res = await fetch(`https://restcountries.com/v2/name/${country}`);
  const data = await res.json();
  // console.log(data);
  return renderCountryHighlight(data[0]);
};

// getCountryDataCard("antarctica");
// getCountryDataHighlight("antarctica");

// #################################################################################
// ###############################################################################
// ###### RENDERING ALL CARD COUNTRIES ON PAGE. ####################

const getCountries = async function () {
  // countriesContainer.innerHTML = "";

  const res = await fetch("https://restcountries.com/v2/all");
  const data = await res.json();
  data.map((country) => renderCountry(country));
  // console.log(data);
  showExpandedCountry();
};
// DISPLAYING COUNTRIES AFER PAGE IS LOADED. - in theme toggle.js
// window.onload = () => getCountries();

// ############ END RENDERING ALL CARD COUNTRIES ON PAGE. ##################
// #####################################################################################
// #######################################################################################


// #################################################################################
// ########################################################
// ########## FILTER FUNCTIONALITY ########################

// SELECT DROPDOWN FILTER CONTINENTS
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
});

optionsList.forEach((o) => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
  });
});

// FILTER BY CONTINENTS
const continents = document.querySelectorAll(".option");

const getContinent = async function (continent) {
  const res = await fetch("https://restcountries.com/v2/all");
  const data = await res.json();
  const filteredArr = data.filter(
    (el) => el.region.toLowerCase() === continent.toLowerCase()
  );
  countriesContainer.innerHTML = "";
  filteredArr.map((region) => renderCountry(region));
  showExpandedCountry();
};

continents.forEach((el) => {
  el.addEventListener("click", () => {
    let firstChild = el.firstChild.nextSibling.id;
    getContinent(`${firstChild}`);
  });
});

// ########## END FILTER FUNCTIONALITY ########################
// ############################################################
// #################################################################################


const fetchData = async function (
  all,
  continents,
  countryCard,
  countryExpanded
) {
  try {

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v2/all`),
    ]);






  } catch (err) {
    console.log(err);
  }
};


const allCountries = await getJSON(`https://restcountries.com/v2/all`);
// console.log(allCountries);
allCountries.map((countries) => renderCountry(countries));
// showExpandedCountry();

if (code) {
  code = allCountries.filter(
    (el) => el.alpha3Code.toLowerCase() === code.toLowerCase()
  )[0].name;
  console.log(code);
}

countryHighlight = document.querySelectorAll(".country");
console.log(countryHighlight);

if (country) {
  singleCountryArr = await getJSON(
    `https://restcountries.com/v2/name/${country}`
  );
  console.log(singleCountryArr);
  singleCountry = renderCountryHighlight(singleCountryArr[0]);
}
// console.log(singleCountry);

countryHighlight.forEach((el) =>
  el.addEventListener("click", function (e) {
    console.log("ok");
    singleCountry = renderCountryHighlight(singleCountryArr[0]);
    console.log(singleCountry);
    searchComponent.classList.add("search-country-disabled");
    countriesContainer.innerHTML = "";
    countryToHighlight = el.id.toLowerCase();
    renderCountryHighlight(singleCountry);
    // fetchData("", "", countryToHighlight);
  })
);
