import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { checkToastMessage, clicksButton, removeToastAuthError } from './page.steps.js';

const codTipoPrefix = 'LICENZA_UX_';
const descTipoPrefix = 'Licenza per UX test ';

When('inserisce i dati obbligatori relativi al nuovo tipo dovuto Licenza {word} e clicca su Salva', tipoDovutoId => insertTipoDovuto(tipoDovutoId)) 
async function insertTipoDovuto(tipoDovutoId) {
    const codIpaEnte = context.latestCodIpaEnte;
    const codTipoDovuto = codTipoPrefix + tipoDovutoId;
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

Then('il tipo dovuto Licenza A è presente nella lista con stato {word}, di default', status => checkTipoDovutoStatus(status))    
async function checkTipoDovutoStatus (status) {
    await clicksButton('Indietro');
    await removeToastAuthError();

    await page.locator('#input-codTipo').fill(context.latestCodTipoDovuto);
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