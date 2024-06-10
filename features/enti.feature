#language: it
@ente
Funzionalità: Gestione Enti

    @ricerca
    Scenario: L'utente Amministratore Globale visualizza l'Ente Demo nella lista
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        Quando clicca su Visualizza tutti gli enti
        Allora l'utente visualizza l'Ente Demo nella lista

    @creazione
    Scenario: L'utente Amministratore Globale crea un nuovo Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione Gestione enti di Back office
        E clicca su Inserisci nuovo ente
        Quando inserisce i dati obbligatori relativi al nuovo Ente X e clicca su Salva
        Allora il nuovo Ente X viene inserito correttamente
        E l'utente visualizza l'Ente X nella lista
