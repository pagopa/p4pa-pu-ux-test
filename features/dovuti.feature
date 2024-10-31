#language: it
@dovuti
Funzionalità: Gestione dovuti

    # SCENARIO DISABLED (Checkout is not available)
    # @pagamento
    # Scenario: L'Operatore inserisce un nuovo dovuto e il cittadino effettua il pagamento tramite checkout
    #     Dato l'utente Operatore che effettua la login
    #     Ed entra nella sezione 'Gestione dovuti'
    #     E inserisce correttamente il nuovo dovuto di importo 32,40 € con generazione avviso
    #     E dato il debitore che paga correttamente il dovuto tramite checkout
    #     Quando tra i filtri di ricerca di tipo Nell'archivio inserisce lo IUV relativo al dovuto e clicca su Cerca
    #     Allora il dovuto è presente nella lista con stato "Pagato" e con importo 32,40 €
    #     Quando tra le azioni disponibili clicca su Scarica ricevuta
    #     Allora in automatico viene scaricato un file pdf contenente i dati relativi al pagamento dell'avviso

    @avviso
    Scenario: L'Operatore dopo l'inserimento di un nuovo dovuto, ne visualizza il dettaglio scaricando l'avviso
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E inserisce correttamente il nuovo dovuto di importo 89,75 € con generazione avviso
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Da Pagare" e con importo 89,75 €
        Quando tra le azioni disponibili clicca su Scarica avviso
        Allora in automatico viene scaricato un file pdf contenente i dati relativi all'avviso creato

    Scenario: L'Operatore prova ad inserire un dovuto senza anagrafica
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E clicca su Inserisci
        Quando prova ad inserire i dati relativi al nuovo dovuto di importo 42 € senza anagrafica
        Allora l'utente nella casella "Anagrafica" visualizza l'avviso di "Campo obbligatorio"
        E l'azione Salva risulta disabilitata

    @multibeneficiario
    Scenario: L'Operatore inserisce un dovuto multibeneficiario
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E clicca su Inserisci
        Ed inizia ad inserire i dati obbligatori del nuovo dovuto di importo 76,48 € 
        Quando spunta la casella Dovuto Multibeneficiario
        Allora la casella Genera avviso risulta spuntata di default e non modificabile
        Quando inserisce i dati obbligatori relativi al dovuto secondario di importo 23,52 € e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto inserito correttamente"
        E cliccando su Torna indietro
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto multibeneficiario è presente nella lista con stato "Da Pagare" e con importo 100,00 €
        Quando tra le azioni disponibili clicca su Mostra altri campi
        Allora nel dettaglio dati sono presenti due sezioni con i dati dell'Ente Primario e dell'Ente Secondario    
    
    Scenario: L'Operatore modifica la data scadenza di un dovuto scaduto
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E tra i filtri di ricerca di tipo Online seleziona lo stato Scaduto con data scadenza compresa negli ultimi 15 giorni e clicca su Cerca
        E selezionando il primo dovuto della lista
        E tra le azioni disponibili clicca su Modifica dovuto
        Quando modifica la data scadenza del dovuto prorogandola di 20 giorni e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto modificato correttamente"
        E cliccando su Torna indietro
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Da Pagare" e con data scadenza aggiornata

    Scenario: L'Operatore annulla un dovuto
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E inserisce correttamente il nuovo dovuto di importo 47,05 € con generazione avviso
        E tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        Quando tra le azioni disponibili clicca su Annulla dovuto
        E clicca su Conferma
        Allora l'utente visualizza il messaggio di "Dovuto annullato correttamente"
        Quando tra i filtri di ricerca di tipo Nell'archivio inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Annullato"

    Scenario: L'Operatore inserisce un dovuto con codice fiscale anonimo
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E clicca su Inserisci
        Quando inserisce i dati obbligatori del nuovo dovuto con codice fiscale anonimo e con generazione avviso e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto inserito correttamente"
        E cliccando su Torna indietro
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e spunta la casella CF anonimo e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Da Pagare"

    Scenario: L'Operatore prova a ricercare un dovuto tramite codice fiscale inserendolo non correttamente
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        Quando tra i filtri di ricerca di tipo Online inserisce un codice fiscale errato
        Allora l'utente nella casella "Codice fiscale / partita IVA" visualizza l'avviso di "Valore non corretto"
        E l'azione Cerca risulta disabilitata

    Scenario: L'Operatore inserisce un dovuto senza generazione avviso e lo ricerca con lo IUD
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E clicca su Inserisci
        Quando inserisce i dati obbligatori del nuovo dovuto di importo 51,76 e senza generazione avviso e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto inserito correttamente"
        E cliccando su Torna indietro
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUD relativo al dovuto e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Da Pagare" senza IUV

    Scenario: L'Operatore dopo aver inserito un dovuto modifica l'importo
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E inserisce correttamente il nuovo dovuto di importo 67,15 € con generazione avviso
        E tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        E tra le azioni disponibili clicca su Modifica dovuto
        Quando modifica l'importo del dovuto con 69,15 € e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto modificato correttamente"
        E cliccando su Torna indietro
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Da Pagare" e con importo 69,15 €

    Scenario: L'Operatore prova a modificare la data scadenza di un dovuto inserendo una data retroattiva
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E inserisce correttamente il nuovo dovuto di importo 60,09 € con generazione avviso
        E tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        E tra le azioni disponibili clicca su Modifica dovuto
        Quando modifica la scadenza con una data precedente a oggi e clicca su Salva
        Allora l'utente visualizza il messaggio di "La data scadenza inserita non può essere retroattiva"
    
    