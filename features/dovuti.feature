#language: it
@dovuti
Funzionalità: Gestione dovuti

    @pagamento
    Scenario: L'Operatore inserisce un nuovo dovuto e il cittadino effettua il pagamento tramite checkout
        Dato l'utente Operatore che effettua la login
        Ed entra nella sezione 'Gestione dovuti'
        E clicca su Inserisci
        Quando inserisce i dati obbligatori del nuovo dovuto con generazione avviso e clicca su Salva
        Allora l'utente visualizza il messaggio di "Dovuto inserito correttamente"
        E il dovuto è presente nella lista con stato Da Pagare
        Quando il cittadino paga il dovuto tramite checkout
        Allora il dovuto è presente nella lista dell'archivio con stato Pagato
