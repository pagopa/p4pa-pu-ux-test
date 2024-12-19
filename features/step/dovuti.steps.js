import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getEnteNameOfUser } from './login.steps.js';
import { citizenInfo, checkoutInfo, enteInfo } from '../../config/config.mjs';
import { checkToastMessage, clicksButton } from './page.steps.js';
import { firstOfNextMonth, getPDFContents, removeFile } from '../../utils/utility.js';
import { console } from 'inspector';

const citizen = citizenInfo.maria;
const card = citizenInfo.maria.card;

//insert 
async function inputInsertDovuto(amount, cfAnonimo){
    const dovuto = {
        "tipoDovuto": "Licenza per ux test",
        "anagrafica": citizen.name,
        "codFiscale": citizen.fiscalCode,
        "email": citizen.email,
        "importo": amount,
        "causale": "Dovuto ux test",
        "scadenza": firstOfNextMonth()
    };

    await expect(page.getByRole('heading', { name: 'Inserimento dovuto'})).toBeVisible();
    await expect(page.locator('#input-ente')).toHaveValue(getEnteNameOfUser(context.userLogged));
    await page.locator('#mat-select-tipoDovuto').click();
    await page.getByRole('option', { name: dovuto.tipoDovuto }).click();
    await page.locator('#input-anagrafica').fill(dovuto.anagrafica);
    await page.locator('#mat-select-tipoSoggetto').click();
    await page.getByRole('option', { name: 'Soggetto fisico' }).click();
    if (cfAnonimo){
        await page.locator('#mat-checkbox-flgAnagraficaAnonima-input').check();
        await expect(page.locator('#input-codFiscale')).not.toBeEnabled();
    } else {
        await page.locator('#input-codFiscale').fill(dovuto.codFiscale);
    }
    await page.locator('#input-email').fill(dovuto.email);
    await page.locator('#input-importo').fill(dovuto.importo);
    await page.locator('#input-dataScadenza').fill(dovuto.scadenza);
    await page.locator('#input-causale').fill(dovuto.causale);

    context.dovuto = dovuto;
}

When('inserisce i dati obbligatori del nuovo dovuto di importo {} con generazione avviso e clicca su Salva', async function(amount){
    await insertDovuto(amount, false)
})
When('inserisce i dati obbligatori del nuovo dovuto con codice fiscale anonimo e con generazione avviso e clicca su Salva', async function() {
    await insertDovuto('24,5', true);
})
async function insertDovuto(amount, cfAnonimo) {
    await inputInsertDovuto(amount, cfAnonimo);
    await page.locator('#mat-checkbox-flgGenerateIuv-input').check();
    await expect(page.locator('#mat-checkbox-flgGenerateIuv-input')).toBeChecked();

    await page.locator('#mat-checkbox-ignorePdnd-input').check();
    await expect(page.locator('#mat-checkbox-flgGenerateIuv-input')).toBeChecked();

    await clicksButton('Salva');
    await expect(page.inputValue('#input-Iuv')).not.toBeNull();
    await expect(page.inputValue('#input-IUD')).not.toBeNull();
    context.dovuto["iuv"] = await page.inputValue('#input-Iuv');
    context.dovuto["iud"] = await page.inputValue('#input-IUD');
}

Given('inserisce correttamente il nuovo dovuto di importo {} € con generazione avviso', async amount => {
    await page.locator('#button-insert').click()
    await insertDovuto(amount);
    await checkToastMessage('Dovuto inserito correttamente');
    await page.locator('#button-goBack').click();
})

When('prova ad inserire i dati relativi al nuovo dovuto di importo {} € senza anagrafica', async amount => {
    await inputInsertDovuto(amount);
    await page.locator('#input-anagrafica').fill('');
})

Given('inizia ad inserire i dati obbligatori del nuovo dovuto di importo {} €', async amount => {
    await inputInsertDovuto(amount);
})

When('inserisce i dati obbligatori relativi al dovuto secondario di importo {} € e clicca su Salva', async function (amount) {
    await expect(page.locator('#form-dovuti-multibeneficiario')).toBeVisible();
    await page.locator('#input-enteMultibeneficiario').click();
    await page.getByRole('option', { name: enteInfo.intermediato1.name }).click();
    await expect(page.locator('#input-denominazione')).toHaveValue(enteInfo.intermediato1.name);
    await expect(page.locator('#input-codiceFiscale')).toHaveValue(enteInfo.intermediato1.fiscalCode);
    await expect(page.locator('#input-ibanAddebito')).toHaveValue(enteInfo.intermediato1.iban);

    await page.locator('#input-importoSecondario').fill(amount);
    await page.locator('#input-datiSpecificiRiscossione').fill(enteInfo.intermediato1.codTassonomicoTipoDovuto);
    await page.locator('#input-causaleMB').fill('Dovuto ux test multibeneficiario');

    await page.locator('#mat-checkbox-ignorePdnd-input').check();
    await expect(page.locator('#mat-checkbox-flgGenerateIuv-input')).toBeChecked();

    await clicksButton('Salva');
    await expect(page.inputValue('#input-Iuv')).not.toBeNull();
    context.dovuto["iuv"] =  await page.inputValue('#input-Iuv');
}) 

When('inserisce i dati obbligatori del nuovo dovuto di importo {} e senza generazione avviso e clicca su Salva', async function(amount) {
    await inputInsertDovuto(amount, false);

    await page.locator('#mat-checkbox-ignorePdnd-input').check();
    await expect(page.locator('#mat-checkbox-flgGenerateIuv-input')).toBeChecked();
    
    await clicksButton('Salva');

    await expect(page.inputValue('#input-IUD')).not.toBeNull();
    context.dovuto["iud"] = await page.inputValue('#input-IUD');
    console.log(context.dovuto["iud"]);
})

//modify
When('modifica l\'importo del dovuto con {} € e clicca su Salva', async function(amount) {
    await expect(page.getByRole('heading', { name: 'Modifica dovuto'})).toBeVisible();
    await expect(page.locator('#mat-select-tipoDovuto')).not.toBeEnabled();
    await expect(page.locator('#input-IUD')).not.toBeEditable();

    await page.locator('#input-importo').fill(amount);

    await page.locator('#button-save').click();
})

When('modifica la data scadenza del dovuto prorogandola di 20 giorni e clicca su Salva', async function() {
    var dataScadenza = new Date();
    dataScadenza.setDate(dataScadenza.getDate() + 20);
    context.dovuto["scadenza"] = dataScadenza.toLocaleDateString("it-IT");

    await page.locator('#input-dataScadenza').fill(dataScadenza.toLocaleDateString("it-IT"));

    await page.locator('#button-save').click();
})

When('modifica la scadenza con una data precedente a oggi e clicca su Salva', async function(){
    var dataScadenza = new Date();
    dataScadenza.setDate(dataScadenza.getDate() - 2);
    await page.locator('#input-dataScadenza').fill(dataScadenza.toLocaleDateString("it-IT"));

    await page.locator('#button-save').click();
})

//search
When('tra i filtri di ricerca di tipo {} inserisce lo IUV relativo al dovuto e clicca su Cerca', async function (type) { 
    await searchWithFilter(type, context.dovuto.iuv, false, null);
})
Given('tra i filtri di ricerca di tipo {} inserisce lo IUV relativo al dovuto e spunta la casella CF anonimo e clicca su Cerca', async function (type) {
    await searchWithFilter(type, context.dovuto.iuv, true, null);
})
When('tra i filtri di ricerca di tipo {} inserisce lo IUD relativo al dovuto e clicca su Cerca', async function (type) {
    await searchWithFilter(type, null, false, context.dovuto.iud)
})
async function searchWithFilter(type, iuv, cfAnonimo, iud) {
    await page.locator('#button-reset').click();

    await page.locator('#mat-select-searchtype').click();
    await page.getByRole('option', { name: type, exact: true}).click();
    if(iuv != null){
        await page.locator('#input-iuv').fill(iuv);
    }
    if(iud != null){
        await page.locator('#input-iud').fill(iud);
    }
    if (cfAnonimo){
        await page.locator('#mat-checkbox-cfAnonimo-input').check();
        await expect(page.locator('#input-codFiscale')).toHaveValue('ANONIMO');
    }
    await page.locator('#button-submit').click();
}

Given('tra i filtri di ricerca di tipo {} seleziona lo stato {word} con data scadenza compresa negli ultimi 15 giorni e clicca su Cerca', async function (type, status){
    await page.locator('#mat-select-searchtype').click();
    await page.getByRole('option', { name: type, exact: true}).click();
    await page.locator('#mat-select-state').click();
    await page.getByRole('option', { name: status, exact: true}).click();

    const dateTo = new Date();
    const dateFrom = new Date(new Date().setDate(new Date().getDate() - 15));
    
    await page.locator('#input-dateFrom').fill(dateFrom.toLocaleDateString("it-IT"));
    await page.locator('#input-dateTo').fill(dateTo.toLocaleDateString("it-IT"));

    await page.locator('#button-submit').click();
})

When('tra i filtri di ricerca di tipo {} inserisce un codice fiscale errato', async function (type) {
    await page.locator('#mat-select-searchtype').click();
    await page.getByRole('option', { name: type, exact: true}).click();
    await page.locator('#input-codFiscale').fill('NOT_VALID');
    await page.mouse.down();
})

Given('selezionando il primo dovuto della lista', async function (){
    context.dovuto = {};
    context.dovuto["iuv"] = await page.locator('table').locator('tr').nth(1).locator('td').nth(0).innerText();
    context.dovuto["multibeneficiario"] = await page.locator('table').locator('tr').nth(1).locator('td').nth(5).innerText();
})

Then('il dovuto è presente nella lista con stato {string}', (status) => checkInfoDovutoInList(status, null, false))
Then('il dovuto è presente nella lista con stato {string} e con importo {}', (status, amount) => checkInfoDovutoInList(status, amount, false))
Then('il dovuto multibeneficiario è presente nella lista con stato {string} e con importo {}', (status, amount) => checkInfoDovutoInList(status, amount, true))

async function checkInfoDovutoInList(status, amount, isMultibeneficiario) {
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText(context.dovuto.iuv);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(4)).toContainText(status);
    if(amount != null) {
        await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(2)).toContainText(amount);
    }

    if(isMultibeneficiario) {
        await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(5)).toContainText('SI');
    } else {
        await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(5)).toContainText('No');
    }
}

Then('il dovuto è presente nella lista con stato {string} senza IUV', async function (status) {
    await expect(page.locator('table')).toBeVisible();
    
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText('');
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(4)).toContainText(status);
})

Then('nel dettaglio dati sono presenti due sezioni con i dati dell\'Ente Primario e dell\'Ente Secondario', async function() {
    await expect(page.locator('#mat-card-details')).toBeVisible();

    await expect(page.locator('#mat-card-content-ente-primario')).toBeVisible();
    await expect(page.locator('#mat-card-content-ente-primario').filter({ hasText: enteInfo.intermediato2.fiscalCode})).toBeVisible();
    await expect(page.locator('#mat-card-content-ente-primario').filter({ hasText: enteInfo.intermediato2.iban})).toBeVisible();

    await expect(page.locator('#mat-card-content-ente-secondario')).toBeVisible();
    await expect(page.locator('#mat-card-content-ente-secondario').filter({ hasText: enteInfo.intermediato1.fiscalCode})).toBeVisible();
    await expect(page.locator('#mat-card-content-ente-secondario').filter({ hasText: enteInfo.intermediato1.iban})).toBeVisible();
})

Then('il dovuto è presente nella lista con stato {string} e con data scadenza aggiornata', async function (status){
    var isMultibeneficiario = false;
    if (context.dovuto.multibeneficiario == 'SI') { 
        isMultibeneficiario = true 
    };

    await checkInfoDovutoInList(status, null, isMultibeneficiario);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(3)).toContainText(context.dovuto.scadenza);
})

//pagamento
Given('dato il debitore che paga correttamente il dovuto tramite checkout', async function () {
    const dovutoIuv = context.dovuto.iuv;
    const pageCheckout = await global.context.newPage();
    await pageCheckout.goto(checkoutInfo.pageUrl);
    await expect(pageCheckout.getByText('Paga un avviso')).toBeVisible();
    await pageCheckout.getByRole('link', { name: 'Inserisci tu i dati' }).click();
    await pageCheckout.getByRole('textbox', { name: 'Codice Avviso'}).fill('3' + dovutoIuv);
    await pageCheckout.getByRole('textbox', { name: 'Codice Fiscale Ente Creditore'}).fill(enteInfo.intermediato2.fiscalCode);
    await pageCheckout.getByRole('button', { name: 'Continua', exact: true }).click();
    await pageCheckout.getByRole('button', { name: 'Vai al pagamento', exact: true }).click();
    await pageCheckout.getByRole('textbox', { name: 'Indirizzo email'}).fill(checkoutInfo.email);
    await pageCheckout.getByRole('textbox', { name: 'Ripeti di nuovo'}).fill(checkoutInfo.email);
    await pageCheckout.getByRole('button', { name: 'Continua', exact: true }).click();
    await pageCheckout.getByText(checkoutInfo.paymentMethod).click();
    await pageCheckout.frameLocator('#frame_CARD_NUMBER').getByPlaceholder('0000 0000 0000').fill(card.number);
    await pageCheckout.frameLocator('#frame_EXPIRATION_DATE').getByPlaceholder('MM/AA').fill(card.expirationDate);
    await pageCheckout.frameLocator('#frame_SECURITY_CODE').getByPlaceholder('123').fill(card.securityCode);
    await pageCheckout.frameLocator('#frame_CARDHOLDER_NAME').getByPlaceholder('Nome riportato sulla carta').fill(citizen.name);
    await pageCheckout.getByRole('button', { name: 'Continua', exact: true }).click();
    await pageCheckout.getByRole('button', { name: 'Modifica PSP', exact: true }).click();
    await pageCheckout.getByText('Postepay').scrollIntoViewIfNeeded();
    await pageCheckout.getByText('Postepay').click();
    await pageCheckout.getByRole('button', { name: 'Paga' }).click();
    await expect(pageCheckout.getByText('Il pagamento è in corso')).toBeVisible({ timeout: 30000 });
    await pageCheckout.getByRole('button', { name: 'Chiudi' }).click({ timeout: 100000 });

    await pageCheckout.close();
})

//avviso
Then('in automatico viene scaricato un file pdf contenente i dati relativi all\'avviso creato', async function() {
    const download = await context.downloadPromise;
    const filePath = './report/download/' + download.suggestedFilename();
    await download.saveAs(filePath);
    
    const pdfContents = await getPDFContents(filePath);
    const pdfAvviso = pdfContents.Pages[0];
    const dovuto = context.dovuto;

    expect((decodeURIComponent(pdfAvviso.Texts[36].R[0].T)).replaceAll(' ','')).toBe('3' + dovuto.iuv);
    expect((decodeURIComponent(pdfAvviso.Texts[6].R[0].T))).toBe(dovuto.codFiscale);
    expect((decodeURIComponent(pdfAvviso.Texts[39].R[0].T))).toBe(dovuto.anagrafica);
    expect((decodeURIComponent(pdfAvviso.Texts[40].R[0].T))).toBe(dovuto.causale);
    expect((decodeURIComponent(pdfAvviso.Texts[17].R[0].T))).toBe(dovuto.scadenza);
    expect((decodeURIComponent(pdfAvviso.Texts[52].R[0].T))).toBe(dovuto.importo);
    expect((decodeURIComponent(pdfAvviso.Texts[37].R[0].T))).toBe(enteInfo.intermediato2.fiscalCode);
    expect((decodeURIComponent(pdfAvviso.Texts[38].R[0].T))).toBe(enteInfo.intermediato2.name);

    await download.delete();
    removeFile(filePath);
})

//ricevuta
Then('in automatico viene scaricato un file pdf contenente i dati relativi al pagamento dell\'avviso', async function() {
    const download = await context.downloadPromise;
    const filePath = './report/download/' + download.suggestedFilename();
    await download.saveAs(filePath);
    
    const pdfContents = await getPDFContents(filePath);
    const pdfRT = pdfContents.Pages[0];
    const dovuto = context.dovuto;
    const datePayment = new Date();

    expect((decodeURIComponent(pdfRT.Texts[6].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[7].R[0].T))).toBe('ID UNIVOCO VERSAMENTO: '+ dovuto.iuv);
    expect((decodeURIComponent(pdfRT.Texts[8].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[9].R[0].T))).toBe('DOMINIO ENTE: '+ enteInfo.intermediato2.fiscalCode);
    expect((decodeURIComponent(pdfRT.Texts[36].R[0].T))).toBe(dovuto.codFiscale);
    expect((decodeURIComponent(pdfRT.Texts[13].R[0].T))).toBe('Pagamento eseguito');
    expect((decodeURIComponent(pdfRT.Texts[79].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[85].R[0].T))).toBe('Data pagamento ' + datePayment.toLocaleDateString("it-IT"));
    expect((decodeURIComponent(pdfRT.Texts[80].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[82].R[0].T))).toBe('Importo pagato € '+ dovuto.importo);
    expect((decodeURIComponent(pdfRT.Texts[84].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[83].R[0].T))).toBe('Id Univoco Dovuto '+ dovuto.iud);
    expect((decodeURIComponent(pdfRT.Texts[90].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[91].R[0].T))).toBe('Dati Specifici Riscossione '+ enteInfo.intermediato2.codTassonomicoTipoDovuto);
    expect((decodeURIComponent(pdfRT.Texts[92].R[0].T) + ' ' + decodeURIComponent(pdfRT.Texts[93].R[0].T))).toBe('Causale versamento '+ dovuto.causale);

    await download.delete();
    removeFile(filePath);
})


