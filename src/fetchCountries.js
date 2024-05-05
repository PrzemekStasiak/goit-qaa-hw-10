export const fetchCountries = name => {
  //zadeklarowanie funkcji fetchCountries celem pobieranai danych o ktrajach
  const BASE_URL = 'https://restcountries.com/v3.1/name/'; //podanie adresu z którego będa pobierane dane
  const properties = 'fields=name,capital,population,flags,languages'; //określenie zakresu pobieranych danych

  return fetch(`${BASE_URL}${name}?${properties}`) // funkcji pobrania danych
    .then(response => {
      // gdy odpowiedż ok
      return response.json(); // to zwróć dane json
    })
    .catch(error => console.log(error.message)); // gdy błąd  to w konsoli wyświetl error.message
};
