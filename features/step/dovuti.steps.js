import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getEnteNameOfUser } from './login.steps.js';
import { citizenInfo, checkoutInfo, enteInfo } from '../../config/config.mjs';
import { checkToastMessage, clicksButton } from './page.steps.js';
import { firstOfNextMonth, getPDFContents, removeFile } from '../../utils/utility.js';

const citizen = citizenInfo.maria;
const card = citizenInfo.maria.card;

//insert 
async function inputInsertDovuto(amount){
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
    await page.locator('#input-codFiscale').fill(dovuto.codFiscale);
    await page.locator('#input-email').fill(dovuto.email);
    await page.locator('#input-importo').fill(dovuto.importo);
    await page.locator('#mat-datepicker-toggle-dataScadenza').click();
    await page.getByRole('button', { name: 'Next month', exact: true }).click();
    await page.getByRole('button', { name: '01/'}).click();
    await page.locator('#input-causale').fill(dovuto.causale);

    context.newDovuto = dovuto;
}

When('inserisce i dati obbligatori del nuovo dovuto di importo {} con generazione avviso e clicca su Salva', amount => insertDovuto(amount))
async function insertDovuto(amount) {
    await inputInsertDovuto(amount);
    await page.locator('#mat-checkbox-flgGenerateIuv-input').check();
    await expect(page.locator('#mat-checkbox-flgGenerateIuv-input')).toBeChecked();

    await clicksButton('Salva');
    await expect(page.inputValue('#input-Iuv')).not.toBeNull();
    context.newDovuto["iuv"] =  await page.inputValue('#input-Iuv');
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

    await clicksButton('Salva');
    await expect(page.inputValue('#input-Iuv')).not.toBeNull();
    context.newDovuto["iuv"] =  await page.inputValue('#input-Iuv');;
}) 

//search
When('tra i filtri di ricerca di tipo {} inserisce lo IUV relativo al dovuto e clicca su Cerca', (type) => { searchWithFilter(type, context.newDovuto.iuv)} )
async function searchWithFilter(type, iuv) {
    await page.locator('#mat-select-searchtype').click();
    await page.getByRole('option', { name: type, exact: true}).click();
    await page.locator('#input-iuv').fill(iuv);
    await page.locator('#button-submit').click();
}

Then('il dovuto è presente nella lista con stato {string} e con importo {}', (status, amount) => checkInfoDovutoInList(status, amount, false))
Then('il dovuto multibeneficiario è presente nella lista con stato {string} e con importo {}', (status, amount) => checkInfoDovutoInList(status, amount, true))

async function checkInfoDovutoInList(status, amount, isMultibeneficiario) {
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText(context.newDovuto.iuv);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(4)).toContainText(status);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(2)).toContainText(amount);

    if(isMultibeneficiario) {
        await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(5)).toContainText('SI');
    } else {
        await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(5)).toContainText('No');
    }
}

//pagamento
Given('dato il debitore che paga correttamente il dovuto tramite checkout', async function () {
    const dovutoIuv = context.newDovuto.iuv;
    const pageCheckout = await global.context.newPage();
    await pageCheckout.goto(checkoutInfo.pageUrl);
    await expect(pageCheckout.getByText('Paga un avviso')).toBeVisible();
    await pageCheckout.getByRole('link', { name: 'Inserisci tu i dati' }).click();
    await pageCheckout.getByRole('textbox', { name: 'Codice Avviso'}).fill('3' + dovutoIuv);
    await pageCheckout.getByRole('textbox', { name: 'Codice Fiscale Ente Creditore'}).fill(enteInfo.fiscalCode.intermediato2);
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
    await expect(pageCheckout.getByText('Operazione confermata')).toBeVisible({ timeout: 30000 });
    await pageCheckout.getByRole('button', { name: 'Chiudi' }).click({ timeout: 100000 });

    await pageCheckout.close();
})

//avviso
Then('in automatico viene scaricato un file pdf contenente i dati relativi all\'avviso creato', async function() {
    const download = await context.downloadPromise;
    const filePath = './report/avvisi/' + download.suggestedFilename();
    await download.saveAs(filePath);
    
    const pdfContents = await getPDFContents(filePath);
    const pdfAvviso = pdfContents.Pages[0];
    const dovuto = context.newDovuto;

    expect((decodeURIComponent(pdfAvviso.Texts[36].R[0].T)).replaceAll(' ','')).toBe('3' + dovuto.iuv);
    expect((decodeURIComponent(pdfAvviso.Texts[6].R[0].T))).toBe(dovuto.codFiscale);
    expect((decodeURIComponent(pdfAvviso.Texts[39].R[0].T))).toBe(dovuto.anagrafica);
    expect((decodeURIComponent(pdfAvviso.Texts[40].R[0].T))).toBe(dovuto.causale);
    expect((decodeURIComponent(pdfAvviso.Texts[17].R[0].T))).toBe(dovuto.scadenza);
    expect((decodeURIComponent(pdfAvviso.Texts[52].R[0].T))).toBe(dovuto.importo);
    expect((decodeURIComponent(pdfAvviso.Texts[37].R[0].T))).toBe(enteInfo.fiscalCode.intermediato2);
    expect((decodeURIComponent(pdfAvviso.Texts[38].R[0].T))).toBe(getEnteNameOfUser(context.userLogged));

    await download.delete();
    removeFile(filePath);
})


