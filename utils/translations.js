const translations = {
  it: {
    "Select your organization": "Seleziona il tuo ente",
    "Sign in": "Accedi",
    "Confirm": "Conferma",
    "Continue": "Continua",
    "Create new": "Crea nuova",
    "Create": "Crea",
    "Debt positions": "Posizioni debitorie",
    "Debt position": "Posizione debitoria",
    "Debt position is been created": "La posizione debitoria '{description}' è stata creata!",
    "Create a new debt position": "Crea una nuova Posizione Debitoria",
    "General configuration": "Configurazione generale",
    "Type of debt position": "Tipo di dovuto",
    "Debt position type org": "Tipo dovuto",
    "Debt position description": "Descrizione Posizione Debitoria",
    "Add debtor": "Aggiungi debitore",
    "Person entity type": "Tipo di soggetto",
    "F": "Persone fisiche",
    "Fiscal code": "Codice Fiscale",
    "Full name": "Nome e cognome",
    "Address": "Indirizzo",
    "Civic": "Civico",
    "Postal code": "CAP",
    "Province": "Provincia",
    "Location": "Località",
    "Notice configuration": "Configurazione avviso",
    "Remittance information": "Oggetto pagamento",
    "Payment option type": "Opzione pagamento",
    "Single installment": "Soluzione unica",
    "Single Installment": "Soluzione Unica",
    "Installments": "Soluzione rateale",
    "Amount": "Importo",
    "Due date": "Data scadenza",
    "What are you looking for?": "Cosa stai cercando?",
    "Search fiscal code": "Cerca Codice Fiscale",
    "Creation from": "Creazione dal",
    "To": "Al",
    "Status": "Stato",
    "Unpaid": "Da pagare",
    "Filter": "Filtra",
    "Back to start": "Torna al'inizio",
    "Info on debt position": "Informazioni sulla posizione debitoria",
    "Debtor": "Debitore",
    "Fiscal code / P. IVA": "CF / Partita IVA",
    "Iupd org": "Codice Interno",
    "Detail on payment option": "Dettaglio soluzione",
    "Description": "Descrizione",
    "Delete": "Elimina"
  }
};

export function getItTranslation(key, params = {}, language = "it") {
  let text = translations[language][key] || key;
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  return text;
}
