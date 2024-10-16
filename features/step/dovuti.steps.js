import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getEnteNameOfUser } from './login.steps.js';
import { citizenInfo, emailForCheckout, enteInfo } from '../../config/config.mjs';
import { clicksButton } from './page.steps.js';

const citizen = citizenInfo.maria;
const card = citizenInfo.maria.card;
const tipoDovutoName = 'Licenza per ux test';

When('inserisce i dati obbligatori del nuovo dovuto con generazione avviso e clicca su Salva', async function () {
    await expect(page.getByRole('heading', { name: 'Inserimento dovuto'})).toBeVisible();
    await expect(page.locator('#input-ente')).toHaveValue(getEnteNameOfUser(context.userLogged));
    await page.locator('#mat-select-tipoDovuto').click();
    await page.getByRole('option', { name: tipoDovutoName }).click();
    await page.locator('#input-anagrafica').fill(citizen.name);
    await page.locator('#mat-select-tipoSoggetto').click();
    await page.getByRole('option', { name: 'Soggetto fisico' }).click();
    await page.locator('#input-codFiscale').fill(citizen.fiscalCode);
    await page.locator('#input-email').fill(citizen.email);
    await page.locator('#input-importo').fill('67,2');
    await page.locator('#mat-datepicker-toggle-dataScadenza').click();
    await page.getByRole('button', { name: 'Next month', exact: true }).click();
    await page.getByRole('button', { name: '01/'}).click();
    await page.locator('#input-causale').fill('Dovuto ux test');

    await page.locator('#mat-checkbox-flgGenerateIuv-input').check();
    await expect(page.locator('#mat-checkbox-flgGenerateIuv-input')).toBeChecked();

    await clicksButton('Salva');
    await expect(page.inputValue('#input-Iuv')).not.toBeNull();
    context.latestDovutoIUV = await page.inputValue('#input-Iuv');
})

Then('il dovuto è presente nella lista con stato {}', async function(status) {
    await clicksButton('Gestione dovuti');
    const dovutoIuv = context.latestDovutoIUV;

    await page.locator('#mat-select-searchtype').click();
    await page.getByRole('option', { name: 'Online', exact: true}).click();
    await page.locator('#input-iuv').fill(dovutoIuv);
    await page.locator('#button-submit').click();

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText(dovutoIuv);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(4)).toContainText(status);
})

Then('il dovuto è presente nella lista dell\'archivio con stato {}', async function(status) {
    const dovutoIuv = context.latestDovutoIUV;

    await page.locator('#mat-select-searchtype').click();
    await page.getByRole('option', { name: 'Nell\'archivio'}).click();
    await page.locator('#input-iuv').fill(dovutoIuv);
    await page.locator('#button-submit').click();

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(0)).toContainText(dovutoIuv);
    await expect(page.locator('table').locator('tr').nth(1).locator('td').nth(4)).toContainText(status);
})

When('il cittadino paga il dovuto tramite checkout', async function () {
    const dovutoIuv = context.latestDovutoIUV;
    global.pageCheckout = await context.newPage();
    await pageCheckout.goto('https://dev.checkout.pagopa.it/');
    await expect(pageCheckout.getByText('Paga un avviso')).toBeVisible();
    await pageCheckout.getByRole('link', { name: 'Inserisci tu i dati' }).click();
    await pageCheckout.getByRole('textbox', { name: 'Codice Avviso'}).fill('3' + dovutoIuv);
    await pageCheckout.getByRole('textbox', { name: 'Codice Fiscale Ente Creditore'}).fill(enteInfo.fiscalCode.intermediato2);
    await pageCheckout.getByRole('button', { name: 'Continua', exact: true }).click();
    await pageCheckout.getByRole('button', { name: 'Vai al pagamento', exact: true }).click();
    await pageCheckout.getByRole('textbox', { name: 'Indirizzo email'}).fill(emailForCheckout);
    await pageCheckout.getByRole('textbox', { name: 'Ripeti di nuovo'}).fill(emailForCheckout);
    await pageCheckout.getByRole('button', { name: 'Continua', exact: true }).click();
    await pageCheckout.locator('div').filter({ hasText: /^Carte di Credito e Debito$/ }).first().click();
    await pageCheckout.frameLocator('#frame_CARD_NUMBER').getByPlaceholder('0000 0000 0000').fill(card.number);
    await pageCheckout.frameLocator('#frame_EXPIRATION_DATE').getByPlaceholder('MM/AA').fill(card.expirationDate);
    await pageCheckout.frameLocator('#frame_SECURITY_CODE').getByPlaceholder('123').fill(card.securityCode);
    await pageCheckout.frameLocator('#frame_CARDHOLDER_NAME').getByPlaceholder('Nome riportato sulla carta').fill(citizen.name);
    await pageCheckout.getByRole('button', { name: 'Continua', exact: true }).click();
    await pageCheckout.getByRole('button', { name: 'Modifica PSP', exact: true }).click();
    await pageCheckout.locator('div').filter({ hasText: /^Worldline Merchant Services Italia S\.p\.A\.$/ }).nth(1).click();
    await pageCheckout.getByRole('button', { name: 'Paga' }).click();
    await expect(pageCheckout.getByText('Operazione confermata')).toBeVisible({ timeout: 30000 });
    await pageCheckout.getByRole('button', { name: 'Chiudi' }).click({ timeout: 100000 });

    await global.pageCheckout.close();
})