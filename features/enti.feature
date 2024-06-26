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
        Allora il nuovo Ente X viene inserito correttamente
        E l'utente visualizza l'Ente X nella lista

    @inserimento 
    @admin_ente
    Scenario: L'utente Amministratore Ente prova ad inserire un nuovo Ente
        Dato l'utente Amministratore Ente che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        Quando prova a cliccare su Inserisci nuove ente
        Allora l'utente vede la funzionalità disabilitata

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
        E clicca su Inserisci nuovo ente
        E dopo aver inserito correttamente il nuovo Ente Y cliccando su Salva
        Quando aggiunge il logo dell'Ente Y e clicca su Modifica Logo
        Allora il logo per l'Ente Y è aggiornato correttamente
        E l'utente visualizza l'Ente Y nella lista con il logo
