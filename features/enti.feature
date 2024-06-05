#language: it
@Ente
Funzionalità: Gestione Enti

    Scenario: L'utente Amministratore Globale visualizza l'Ente Demo nella lista
        Dato l'utente Amministratore Globale che effettua la login correttamente
        E l'utente che entra nella sezione Gestione enti di Back office
        Quando l'utente clicca su Visualizza tutti gli enti
        Allora l'utente visualizza l'Ente Demo