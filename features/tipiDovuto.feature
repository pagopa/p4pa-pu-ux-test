#language: it
@tipi_dovuto
Funzionalità: Gestione tipi dovuto

    # Scenario per creare l'Ente su cui creare i tipi dovuti degli scenari successivi
    @enteT
    Scenario: L'utente Amministratore Globale inserisce un nuovo Ente
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        Ed inserisce correttamente il nuovo Ente T
        Quando ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        Allora nella lista è presente il tipo dovuto Marca da bollo 

    Scenario: L'Amministratore Globale inserisce un nuovo tipo dovuto
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E clicca su Inserisci nuovo tipo dovuto
        Quando inserisce i dati obbligatori relativi al nuovo tipo dovuto Licenza A e clicca su Salva
        Allora l'utente visualizza il messaggio di "Tipo dovuto inserito correttamente"
        Quando clicca su Indietro
        Allora il tipo dovuto Licenza A è presente nella lista con stato Disabilitato, di default

    Scenario: L'Amministratore Globale prova ad inserire un tipo dovuto senza descrizione
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E clicca su Inserisci nuovo tipo dovuto
        Quando prova ad inserire i dati relativi al nuovo tipo dovuto Licenza A senza descrizione
        Allora l'utente nella casella "Descrizione tipo dovuto" visualizza l'avviso di "Campo obbligatorio"
        E l'azione Salva risulta disabilitata

    Scenario: L'Amministratore Globale prova ad inserire un tipo dovuto con codice tipo non valido
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E clicca su Inserisci nuovo tipo dovuto
        Quando inserisce i dati obbligatori relativi al nuovo tipo dovuto Licenza A con codice tipo errato e clicca su Salva
        Allora l'utente visualizza il messaggio di "Codice Tipo Dovuto è invalido"

    Scenario: L'Amministratore Globale modifica il tipo servizio di un tipo dovuto
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E inserisce correttamente il nuovo tipo dovuto Licenza B
        E ricerca nella lista il tipo dovuto Licenza B e tra le azioni disponibili clicca su Dettaglio tipo dovuto
        E clicca su Modifica
        Quando cambia il tipo di servizio e di conseguenza il motivo riscossione e codice tassonomico e clicca su Salva 
        Allora l'utente visualizza il messaggio di "Tipo dovuto aggiornato correttamente"

    Scenario: L'Amministratore Globale modifica tipo dovuto rimuovendo il flag data scadenza obbligatoria
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E inserisce correttamente il nuovo tipo dovuto Licenza C
        E ricerca nella lista il tipo dovuto Licenza C e tra le azioni disponibili clicca su Dettaglio tipo dovuto
        E clicca su Modifica
        Quando rimuove il Flag Data Scadenza Obbligatoria
        Allora il Flag Visualizza Data Scadenza risulta modificabile
        Quando clicca su Salva
        E clicca su Conferma
        Allora l'utente visualizza il messaggio di "Tipo dovuto aggiornato correttamente"

    Scenario: L'Amministratore Globale cancella un tipo dovuto precedentemente inserito
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E inserisce correttamente il nuovo tipo dovuto Licenza D
        Quando ricerca nella lista il tipo dovuto Licenza D e tra le azioni disponibili clicca su Cancella tipo dovuto
        Allora l'utente visualizza il messaggio di "Tipo dovuto cancellato correttamente"
        E il tipo dovuto Licenza D non è presente nella lista

    Scenario: L'Amministratore Globale abilita il tipo dovuto sull'Ente e poi lo disabilita
        Dato l'utente Amministratore Globale che effettua la login
        Ed entra nella sezione 'Gestione enti' di 'Back Office'
        E ricerca l'Ente T nella lista per visualizzarne il dettaglio
        E nel dettaglio ente seleziona il tab Lista Tipi Dovuto
        E inserisce correttamente il nuovo tipo dovuto Licenza E
        Quando ricerca nella lista il tipo dovuto Licenza E e tra le azioni disponibili clicca su Abilita tipo dovuto
        Allora l'utente visualizza il messaggio di "Tipo dovuto abilitato correttamente"
        E il tipo dovuto Licenza E è presente nella lista con stato Abilitato
        Quando tra le azioni disponibili clicca su Registro cambio stato
        Allora visualizza il dettaglio del cambio stato di abilitazione del tipo dovuto Licenza E
        Quando tra le azioni disponibili clicca su Disabilita tipo dovuto
        E clicca su Conferma
        Allora l'utente visualizza il messaggio di "Tipo dovuto disabilitato correttamente"
        E il tipo dovuto Licenza E è presente nella lista con stato Disabilitato
        Quando tra le azioni disponibili clicca su Registro cambio stato
        Allora visualizza il dettaglio del cambio stato di disabilitazione del tipo dovuto Licenza E
