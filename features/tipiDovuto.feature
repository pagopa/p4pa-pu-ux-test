#language: it
@tipi_dovuto
Funzionalità: Gestione tipi dovuto

    @enteA
    Scenario: L'Amministratore Globale inserisce un nuovo tipo dovuto
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E clicca su Inserisci nuovo tipo dovuto
        Quando inserisce i dati obbligatori relativi al nuovo tipo dovuto Licenza A e clicca su Salva
        Allora l'utente visualizza il messaggio di "Tipo dovuto inserito correttamente"
        E il tipo dovuto Licenza A è presente nella lista con stato Disabilitato, di default

    @enteA
    Scenario: L'Amministratore Globale modifica il tipo servizio di un tipo dovuto
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E inserisce correttamente il nuovo tipo dovuto Licenza B
        E ricerca nella lista il tipo dovuto Licenza B e tra le azioni disponibili clicca su Dettaglio tipo dovuto
        E clicca su Modifica
        Quando cambia il tipo di servizio e di conseguenza il motivo riscossione e codice tassonomico e clicca su Salva 
        Allora l'utente visualizza il messaggio di "Tipo dovuto aggiornato correttamente"

    @enteA
    Scenario: L'Amministratore Globale cancella un tipo dovuto precedentemente inserito
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente A nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E inserisce correttamente il nuovo tipo dovuto Licenza C
        Quando ricerca nella lista il tipo dovuto Licenza C e tra le azioni disponibili clicca su Cancella tipo dovuto
        Allora l'utente visualizza il messaggio di "Tipo dovuto cancellato correttamente"
        E il tipo dovuto Licenza C non è presente nella lista