// Import stylesheets
import './style.css';
// Funzione per definire la classe Libro
function definisciClasseLibro() {
  class Libro {
    constructor(posizione, autore, titolo, utentePrestito) {
      this.posizione = posizione;
      this.autore = autore;
      this.titolo = titolo;
      this.utentePrestito = utentePrestito;
    }
  }
  return Libro;
}
// Funzione per definire la classe Archivio
function definisciClasseArchivio(Libro) {
  class Archivio {
    constructor(arrayLibri) {
      this.arrayLibri = arrayLibri;
    }
    // Metodo per trovare i libri che corrispondono ad una certa stringa nel titolo
    trovaLibri(stringaDaCercare) {
      return this.arrayLibri.filter((libro) =>
        libro.titolo.toLowerCase().includes(stringaDaCercare.toLowerCase())
      );
    }
  }
  return Archivio;
}
// Funzione per gestire la ricerca e visualizzare i risultati
function effettuaRicerca(archivio) {
  const inputSearch = document.getElementById('inputRicerca');
  const resultContainer = document.getElementById('risultatiRicerca');
  inputSearch.addEventListener('input', function () {
    const searchString = this.value.trim();
    const results = archivio.trovaLibri(searchString);
    resultContainer.innerHTML = '';
    if (searchString === '') {
      resultContainer.textContent = 'Inserisci un titolo per la ricerca.';
      return;
    }
    if (results.length === 0) {
      resultContainer.textContent = 'Nessun libro corrispondente trovato.';
    } else if (results.length === 1) {
      const libro = results[0];
      resultContainer.textContent = `Autore: ${libro.autore}, Titolo: ${libro.titolo}`;
    } else {
      resultContainer.textContent = `${results.length} libri corrispondenti trovati.`;
    }
  });
}
// Funzione per caricare l'array di libri dal database esterno
function caricamentoLibri(callback) {
  // URL del database esterno
  const base =
    'https://eu-central-1.aws.data.mongodb-api.com/app/kvaas-giwjg/endpoint';
  const op = 'get';
  const key = '53f6530d';
  const URL = `${base}/${op}?key=${key}`;
  // Fetch dei dati dal database esterno
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      callback(data); // Chiamata della callback con i dati di ritorno come parametro
    })
    .catch((error) =>
      console.error('Errore durante il recupero dei dati:', error)
    );
}
// Funzione di callback per trattare i dati di ritorno e inserirli nell'array di libri
function gestisciDatiLibri(data) {
  // Convertiamo la stringa JSON in un array di oggetti JavaScript
  const arrayDati = JSON.parse(data);
  // Otteniamo le classi Libro e Archivio utilizzando le funzioni definite
  const Libro = definisciClasseLibro();
  const Archivio = definisciClasseArchivio(Libro);
  // Array per memorizzare gli oggetti Libro
  const arrayLibri = [];
  // Iterazione attraverso i dati di ritorno e creazione degli oggetti Libro
  arrayDati.forEach((libro, index) => {
    const nuovoLibro = new Libro(index + 1, libro.autore, libro.titolo, '');
    arrayLibri.push(nuovoLibro);
  });
  // Ora possiamo fare ciò che vogliamo con l'array di libri, ad esempio creare un'istanza di Archivio
  const archivio = new Archivio(arrayLibri);
  console.log('Array di libri caricato:', arrayLibri);
  effettuaRicerca(archivio);
}
// Utilizzo la funzione caricamentoLibri con la callback gestisciDatiLibri
caricamentoLibri(gestisciDatiLibri);
