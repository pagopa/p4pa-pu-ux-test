#language: it
@enti
Funzionalità: Gestione Enti

    @inserimento
    @admin_globale
    Scenario: L'utente Amministratore Globale inserisce un nuovo Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E clicca su Inserisci nuovo ente
        Quando inserisce i dati obbligatori relativi al nuovo Ente A e clicca su Salva
        Allora l'utente visualizza il messaggio di "Ente inserito correttamente"
        E l'Ente A è presente nella lista con stato inserito

    @inserimento 
    @admin_ente
    Scenario: L'utente Amministratore Ente prova ad inserire un nuovo Ente
        Dato l'utente Amministratore Ente che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        Quando prova a cliccare su Inserisci nuove ente
        Allora l'utente vede l'azione disabilitata

    @inserimento
    @admin_globale
    Scenario: L'utente Amministratore Globale prova ad inserire un Ente con codice fiscale non valido 
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E clicca su Inserisci nuovo ente
        Quando inserisce i dati obbligatori relativi al nuovo Ente con codice fiscale non valido e clicca su Salva
        Allora l'utente visualizza l'errore in pagina "Codice Fiscale Ente è invalido"

    @logo
    @admin_globale
    Scenario: L'utente Amministratore Globale inserisce un nuovo Ente aggiungendo il logo
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        Ed inserisce correttamente il nuovo Ente B
        Quando aggiunge il logo dell'Ente B e clicca su Modifica Logo
        Allora l'utente visualizza il messaggio di "Logo aggiornato correttamente"
        E l'Ente B è presente nella lista con stato inserito e con il logo

    @modifica
    @admin_globale
    @enteA
    Scenario: L'utente Amministratore Globale aggiunge altre informazioni di un Ente beneficiario
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E clicca su Modifica
        Quando aggiunge altre informazioni relative all'indirizzo dell'Ente A e clicca su Salva
        Allora l'utente visualizza il messaggio di "Ente aggiornato correttamente"

    @modifica
    @admin_globale
    @enteA
    Scenario: L'utente Amministratore Globale modifica lo stato di un Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E clicca su Modifica
        Quando cambia lo stato dell'Ente A in esercizio e clicca su Salva
        Allora l'utente visualizza il messaggio di "Ente aggiornato correttamente"
        E l'Ente A è presente nella lista con stato esercizio

    @modifica
    @admin_globale
    @enteA
    Scenario: L'utente Amministratore Globale prova a modificare un Ente con email non valida
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E clicca su Modifica
        Quando prova a cambiare l'email dell'Ente in "enteuxtest£email.it"
        Allora l'utente visualizza l'avviso di "Email non valida"

    @funzionalita
    @admin_globale
    @enteA
    Scenario: L'utente Amministratore Globale abilita la funzionalità di Avviso Digitale per un Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Funzionalità
        Quando abilita la funzionalità di Avviso Digitale
        Allora l'utente visualizza il messaggio di "Ente funzionalità abilitato correttamente"
        E la funzionalità di Avviso Digitale risulta in stato abilitato

    @funzionalita
    @admin_globale
    @enteA
    Scenario: L'utente Amministratore Globale disabilita la funzionalità di Pagamento Spontaneo per un Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Funzionalità
        Quando disabilita la funzionalità di Pagamento Spontaneo
        Allora l'utente visualizza il messaggio di "Ente funzionalità disabilitato correttamente"
        E la funzionalità di Pagamento Spontaneo risulta in stato disabilitato
        