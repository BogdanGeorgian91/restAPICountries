// import './style.css'

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

// ###########################################################################
// ###############################################################
// ############### HELPERS #######################################

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
                              }</p>async 
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

// ############ END RENDERING ONLY THE SEARCHED COUNTRY ON PAGE. ##################
// #####################################################################################
// #######################################################################################

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

// ############### END HELPERS #######################################
// ###################################################################
// ##################################################################################

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

// ####################################################################################
// #################################################################
// ################### SEARCH FUNCTIONALITY ########################
const search = document.querySelector(".search_section");
const results = [];
const searchInput = search.querySelector('input[name="search"]');
const searchResults = search.querySelector(".search_results");

fetch("https://restcountries.com/v2/all")
  .then((blob) => blob.json())
  .then((data) => results.push(...data));

function findMatches(wordToMatch, results) {
  return results.filter((response) => {
    const regex = new RegExp(wordToMatch, "gi");
    return response.name.match(regex);
  });
}

function displayMatches() {
  // HIDES ALL RESULTS FROM DISPLAYING IF SOMEONE USES BACKSPACE AFTER TYPING SOMETHING
  if (!searchInput.value) {
    searchResults.style.display = "none";
  } else {
    searchResults.style.display = "block";
  }

  const matchArray = findMatches(this.value, results);

  const suggestion = matchArray
    .map((response) => {
      return `
      <a class="search_suggestion" href="#"> ${response.name}</a>
    `;
    })
    .sort()
    .join("");

  const country = matchArray
    .map((response) => {
      return `
      <article class="country">
          <img class="country__img" src="${response.flag}" />
          <div class="country__data">
              <h3 class="country__name">${response.name}</h3>
              <h4 class="country__region">${response.region}</h4>
              <p class="country__row"><span>Population:</span>${commafy(
                response.population
              )}</p>
              <p class="country__row"><span>Language:</span>${
                response.languages[0].name
              }</p>
              <p class="country__row"><span>Capital:</span>${
                response.capital
              }</p>
          </div>
      </article>
      `;
    })
    .sort()
    .join("");

  // SETS THE SEARCH RESULTS TO THE PAGE
  searchResults.innerHTML = suggestion;

  // DISPLAYS THE COUNTRIES THAT MATCH THE SEARCH
  countriesContainer.innerHTML = country;
  countriesContainer.style.opacity = 1;
}

// allows user to key through results with up and down arrows
searchInput.addEventListener("keyup", (e) => {
  if (![38, 40, 13].includes(e.keyCode)) {
    return;
  }

  const activeClass = "search_suggestion--active";
  const current = search.querySelector(`.${activeClass}`);
  const items = search.querySelectorAll(".search_suggestion");
  let next;

  if (e.keyCode === 40 && current) {
    next = current.nextElementSibling || items[0];
  } else if (e.keyCode === 40) {
    next = items[0];
  } else if (e.keyCode === 38 && current) {
    next = current.previousElementSibling || items[items.length - 1];
  } else if (e.keyCode === 38) {
    next = items[items.length - 1];
  } else if (e.keyCode === 13 && current.href) {
    window.location = current.href;
    return;
  }

  if (current) {
    current.classList.remove(activeClass);
  }
  next.classList.add(activeClass);
});

searchInput.addEventListener("input", displayMatches, (e) => {
  if ([38, 40, 13].includes(e.keyCode)) {
    return;
  }
});

// ################### END SEARCH FUNCTIONALITY ########################
// #####################################################################
// ##################################################################################

export { getCountries };
