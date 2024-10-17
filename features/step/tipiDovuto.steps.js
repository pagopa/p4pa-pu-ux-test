import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { checkToastMessage, clicksButton, removeToastAuthError } from './page.steps.js';

const codTipoPrefix = 'LICENZA_UX_';
const descTipoPrefix = 'Licenza per UX test ';

async function inputInsertTipoDovuto(tipoDovutoId, codTipoDovuto){
    const codIpaEnte = context.latestCodIpaEnte;
    await expect(page.locator('#input-codIpaEnte')).toHaveValue(codIpaEnte);
    await page.locator('#input-codTipo').fill(codTipoDovuto);
    await page.locator('#input-deTipo').fill(descTipoPrefix + tipoDovutoId);
    await page.locator('#mat-select-macroArea').click();
    await page.getByRole('option', { name: '01.SERVIZIO SANITARIO NAZIONALE'}).click();
    await page.locator('#mat-select-tipoServizio').click();
    await page.getByRole('option', { name: '104.Donazioni'}).click();
    await page.locator('#mat-select-motivoRiscossione').click();
    await page.getByRole('option', { name: 'AP'}).click();
    await page.locator('#mat-select-codTassonomico').click();
    await page.locator('#mat-option-codTassonomico').click();
}

When('inserisce i dati obbligatori relativi al nuovo tipo dovuto Licenza {word} e clicca su Salva', tipoDovutoId => insertTipoDovuto(tipoDovutoId)) 
async function insertTipoDovuto(tipoDovutoId) {
    const codTipoDovuto = codTipoPrefix + tipoDovutoId;

    await inputInsertTipoDovuto(tipoDovutoId, codTipoDovuto);

    await clicksButton('Salva');
    await clicksButton('Conferma');
    context.latestCodTipoDovuto = codTipoDovuto;
}

When('inserisce correttamente il nuovo tipo dovuto Licenza {word}', async tipoDovutoId => {
    await clicksButton('Inserisci nuovo tipo dovuto');
    await insertTipoDovuto(tipoDovutoId);
    await checkToastMessage('Tipo dovuto inserito correttamente');
    await clicksButton('Indietro');
    await removeToastAuthError();
})

When('prova ad inserire i dati relativi al nuovo tipo dovuto Licenza {word} senza descrizione', async function (tipoDovutoId) {
    const codTipoDovuto = codTipoPrefix + tipoDovutoId;

    await inputInsertTipoDovuto(tipoDovutoId, codTipoDovuto);
    await page.locator('#input-deTipo').fill('');
}) 

When('inserisce i dati obbligatori relativi al nuovo tipo dovuto Licenza {word} con codice tipo errato e clicca su Salva', async function (tipoDovutoId) {
    const codTipoDovuto = codTipoPrefix + ' ' + tipoDovutoId;
    await inputInsertTipoDovuto(tipoDovutoId, codTipoDovuto);

    await clicksButton('Salva');
    await clicksButton('Conferma');
})

Then('il tipo dovuto Licenza {} è presente nella lista con stato {word}, di default', (tipoDovutoId, status) => checkTipoDovutoStatus(tipoDovutoId, status))
Then('il tipo dovuto Licenza {} è presente nella lista con stato {word}', (tipoDovutoId, status) => checkTipoDovutoStatus(tipoDovutoId, status)) 
async function checkTipoDovutoStatus (tipoDovutoId, status) {    
    await page.locator('#input-codTipo').fill(codTipoPrefix + tipoDovutoId);
    await clicksButton('Cerca');

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText(context.latestCodTipoDovuto);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(2)).toContainText(status);
}

Given('ricerca nella lista il tipo dovuto Licenza {word} e tra le azioni disponibili clicca su {}', async function (tipoDovutoId, action) {
    await page.locator('#input-codTipo').fill(context.latestCodTipoDovuto);
    await clicksButton('Cerca');

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText(context.latestCodTipoDovuto);

    await page.locator('table').locator('tr').nth(1).locator('#button-actions').click();
    await clicksButton(action);

    if(action == 'Dettaglio tipo dovuto'){
        await removeToastAuthError();
        await expect(page.getByRole('heading', { name: 'Dettaglio ente - tipo dovuto'})).toBeVisible();
        await expect(page.getByRole('heading', { name: descTipoPrefix + tipoDovutoId})).toBeVisible();
    } else {
        await clicksButton('Conferma');
    }
})

Then('cambia il tipo di servizio e di conseguenza il motivo riscossione e codice tassonomico e clicca su Salva', async function () {
    await expect(page.locator('#input-codTipo')).toBeDisabled();

    await page.locator('#mat-select-tipoServizio').click();
    await page.getByRole('option', { name: '100.Ticket Sanitario'}).click();
    await page.locator('#mat-select-motivoRiscossione').click();
    await page.getByRole('option', { name: 'TS'}).click();
    await page.locator('#mat-select-codTassonomico').click();
    await page.locator('#mat-option-codTassonomico').click();

    await clicksButton('Salva');
    await clicksButton('Conferma');
})

Then('il tipo dovuto Licenza {word} non è presente nella lista', async function (tipoDovutoId) {
    await page.locator('#input-codTipo').fill(context.latestCodTipoDovuto);
    await clicksButton('Cerca');

    await expect(page.locator('table')).not.toBeVisible();
    await expect(page.getByText('Nessun dato trovato con i criteri di ricerca impostati.')).toBeVisible();
})

When('rimuove il Flag Data Scadenza Obbligatoria', async function () {
    await expect(page.getByRole('checkbox', { name: 'Flag Data Scadenza Obbligatoria', exact: true})).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Flag Visualizza Data Scadenza', exact: true})).not.toBeEnabled();

    await page.getByRole('checkbox', { name: 'Flag Data Scadenza Obbligatoria', exact: true}).setChecked(false);
    await expect(page.getByRole('checkbox', { name: 'Flag Data Scadenza Obbligatoria', exact: true})).not.toBeChecked();
})

Then('il Flag Visualizza Data Scadenza risulta modificabile', async function () {
    await expect(page.getByRole('checkbox', { name: 'Flag Visualizza Data Scadenza', exact: true})).toBeVisible();
})

Then('visualizza il dettaglio del cambio stato di {word} del tipo dovuto Licenza {word}', async function(action, tipoDovutoId) {
    const dialog = await page.getByRole( 'dialog', { name: 'Registro cambio stato abilitazione - Tipo dovuto: '+ descTipoPrefix + tipoDovutoId});
    await expect(dialog).toBeVisible();

    const tableFirstRow = await dialog.locator('table').locator('tr').nth(1);
    if (action == 'abilitazione') {
        await expect(tableFirstRow.locator('td').nth(3)).toContainText('Disabilitato');
        await expect(tableFirstRow.locator('td').nth(4)).toContainText('Abilitato');
    } else {
        await expect(tableFirstRow.locator('td').nth(3)).toContainText('Abilitato');
        await expect(tableFirstRow.locator('td').nth(4)).toContainText('Disabilitato');
    }
    await expect(tableFirstRow.locator('td').nth(2)).toContainText(new Date().toLocaleDateString('it-IT'));
    await page.locator('#button-close').click();
})

Then('nella lista è presente il tipo dovuto Marca da bollo', async function () {
    await page.locator('#input-codTipo').fill('MARCA_BOLLO_DIGITALE');
    await clicksButton('Cerca');

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText('MARCA_BOLLO_DIGITALE');
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(1)).toContainText('Marca da bollo digitale');
})