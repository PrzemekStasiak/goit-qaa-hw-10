import { Notify } from 'notiflix/build/notiflix-notify-aio'; // zimportuj paczkę notify do wyśiwetlania komunikatów
import debounce from 'lodash.debounce'; // zaimportuj debounce celem późniejszegho wykorzystania tzw opóźnienie po wpisywaniu danych
import { fetchCountries } from './fetchCountries'; // zaimportuj funkcjie fetchCountries z plikku fetchCountries

const DEBOUNCE_DELAY = 300; // sutaw stałą DEBOUNCE_DELAY na 300 ms (sutawiamy oóźnienie)

const search = document.querySelector('#search-box'); // ustawienie stałej Serch na elemencie HTML po id search-box
const countryInfo = document.querySelector('.country-info'); // sytawienie stałej countryInfo w HTML po klasie country-info
const countryList = document.querySelector('.country-list'); // sytawienie stałej countryList w HTML po klasie country-list

const inputHandler = x => {
  const textInput = x.target.value.trim(); // sutawienie stałej text input z funkcją trim by wyeliminowac wpisywane w pole Search z tekstu znaki białe

  if (!textInput) {
    //ghdy wpisujemy to zakazdym razem czyścimy country list i country info
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(textInput) //wykorzystujemy zaimportowaną funkcję fetchCountries
    .then(data => {
      if (data.length > 10) {
        // gdy tablica obiektów / kraji jest większa niż 10 tzn gdy znależliśmy więcej niż 10 krajów to
        countryList.innerHTML = ''; //czyścimy pole countryList  z wczesniejszych wyinków
        countryInfo.innerHTML = ''; //czyścimy pole countryInfo z wczesniejszych wynikow
        Notify.info(
          //wykorzystujemy zaimportowana biblioteke notify
          'Too many matches found. Please enter a more specific name' //i informujemy ze znalezionych kraji jest za duzo
        );
        return;
      }
      renderMarkup(data); // w innym przypadku wywolujemy funkcje renderMarkup
    })
    .catch(err => {
      // obskuga błędu
      countryList.innerHTML = ''; //czyścimy pole countryList  z wczesniejszych wyinków
      countryInfo.innerHTML = ''; //czyścimy pole countryInfo z wczesniejszych wynikow
      Notify.failure('Oops..., there is no country with that name'); //komunikat przy błędzie
    });
};

const renderMarkup = data => {
  //określmy funkcję renderMarkup  wyświetlanie uzyskanych wyników
  if (data.length === 1) {
    // gdy z wyszukkanych wynikow jest tylko 1 to
    countryList.innerHTML = ''; //czyścimy poprzednei wyniki wyszukiwania
    const markupInfo = createInfoMarkup(data); // ustuawiamy stałą markupInfo i wywolujemy funkcje do zobrazowania w HTML uzuskanych danych o znalezionym kraju czyli createInfoMarkup(data)
    countryInfo.innerHTML = markupInfo; // z uzyskanych danych wstawiamy do HTML informacje do wiświetlenia
  } else {
    // w innym przypadku czyli gdy znalezionych przypadkow jest więcej niż1 a mniej niż 10
    countryInfo.innerHTML = ''; // czyścimy listę uprzednio wyświetloną
    const markupList = createListMarkup(data); // sutawiamy stałą na markupList i wywołujemy funkcję do stworzenia danych do wyświetlenia w HTML
    countryList.innerHTML = markupList; // wstawiamy uzyskane dane w stałej markupList do HTML
  }
};

const createListMarkup = data => {
  // funkcja stowrzenia danych do wyświetlenia w tym przypadku listy wyników  >1 i <10
  return data
    .map(
      // uzyskaną tablice obiektów mapujemy
      (
        { name, flags } //bierzemy jedynie nazwę i flagę
      ) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="80" height="55">${name.official}</li>` //określenie linijki kodu HTML do wsawienia
    )
    .join(''); //wrzuć przrobiony obiekt do tablicy
};

const createInfoMarkup = data => {
  // fukcja tworzenia szczegułowych danych z tlyko 1 wynikuk odpowiedzi z bazy danych
  return data.map(
    (
      { name, capital, population, flags, languages } // pobierany nazwę, nazwę strolicy, populację, flagę i języki ortaz jak poniżej tworzymy linijki kodu HTM clee wyświetlenia tych dancyh na stronie
    ) =>
      `<img src="${flags.png}" alt="${name.official}" width="400" height="200">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

search.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY)); // na polu serach ustawiamy nasluchiwanie na imput czyli wpisywanie oraz wykorzustujemy biblioteke debounce ze stala czyli DEBOUNCE_DELAY opoznienie 300ms
