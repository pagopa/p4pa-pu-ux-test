#language: it
@dovuti
Funzionalità: Gestione dovuti

    @pagamento
    Scenario: L'Operatore inserisce un nuovo dovuto e il cittadino effettua il pagamento tramite checkout
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E inserisce correttamente il nuovo dovuto di importo 32,40 € con generazione avviso
        E dato il debitore che paga correttamente il dovuto tramite checkout
        Quando tra i filtri di ricerca di tipo Nell'Archivio inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto è presente nella lista con stato "Pagato" e con importo 32,40 €

        # ricevuta

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
    @test
    Scenario: L'Operatore inserisce un dovuto multibeneficiario
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E clicca su Inserisci
        Ed inizia ad inserire i dati obbligatori del nuovo dovuto di importo 76,48 € 
        Quando spunta la casella Dovuto Multibeneficiario
        Allora la casella Genera avviso risulta spuntata di default e non modificabile
        Quando inserisce i dati obbligatori relativi al dovuto secondario di importo 24,52 € e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto inserito correttamente"
        E cliccando su Indietro
        Quando tra i filtri di ricerca di tipo Online inserisce lo IUV relativo al dovuto e clicca su Cerca
        Allora il dovuto multibeneficiario è presente nella lista con stato "Da Pagare" e con importo 100,00 €

    Scenario: L'Operatore inserisce un dovuto con codice fiscale anonimo

    Scenario: L'Operatore dopo aver inserito un dovuto modifica l'importo

    Scenario: L'Operatore annulla un dovuto

