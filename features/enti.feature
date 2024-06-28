#language: it
@enti
Funzionalità: Gestione Enti

    @inserimento
    @admin_globale
    Scenario: L'utente Amministratore Globale inserisce un nuovo Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        E clicca su Inserisci nuovo ente
        Quando inserisce i dati obbligatori relativi al nuovo Ente X e clicca su Salva
        Allora l'utente visualizza il messaggio di "Ente inserito correttamente"
        E l'Ente X è presente nella lista con stato inserito

    @inserimento 
    @admin_ente
    Scenario: L'utente Amministratore Ente prova ad inserire un nuovo Ente
        Dato l'utente Amministratore Ente che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        Quando prova a cliccare su Inserisci nuove ente
        Allora l'utente vede l'azione disabilitata

    @inserimento
    @admin_globale
    Scenario: L'utente Amministratore Globale prova ad inserire un Ente con codice fiscale non valido 
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        E clicca su Inserisci nuovo ente
        Quando inserisce i dati obbligatori relativi al nuovo Ente con codice fiscale non valido e clicca su Salva
        Allora l'utente visualizza l'errore in pagina "Codice Fiscale Ente è invalido"

    @logo
    @admin_globale
    Scenario: L'utente Amministratore Globale inserisce un nuovo Ente aggiungendo il logo
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        Ed inserisce correttamente il nuovo Ente Y
        Quando aggiunge il logo dell'Ente Y e clicca su Modifica Logo
        Allora l'utente visualizza il messaggio di "logo aggiornato correttamente"
        E l'Ente Y è presente nella lista con stato inserito e con il logo

    @modifica
    @admin_globale
    Scenario: L'utente Amministratore Globale aggiunge altre informazioni di un Ente beneficiario
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        Ed inserisce correttamente il nuovo Ente Z
        E clicca su Modifica
        Quando aggiunge altre informazioni relative all'indirizzo dell'Ente Z e clicca su Salva
        Allora l'utente visualizza il messaggio di "Ente aggiornato correttamente"

    @modifica
    @admin_globale
    @test
    Scenario: L'utente Amministratore Globale modifica lo stato di un Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        Ed inserisce correttamente il nuovo Ente A
        E clicca su Modifica
        Quando cambia lo stato dell'Ente A in esercizio e clicca su Salva
        Allora l'utente visualizza il messaggio di "Ente aggiornato correttamente"
        E l'Ente A è presente nella lista con stato esercizio
