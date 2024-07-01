import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { enteInfo } from '../../config/config.mjs';
import { clicksOn, checkToastMessage } from './page.steps.js';

const codIpaPrefix = 'UX_TEST_';
const nameEntePrefix = 'Ente UX Test ';
const emailEnte = 'enteuxtest@email.it';

async function checkDataEnteList(codIpa, nameEnte, status, withLogo) {
  let checked = false;
  let tableRows = await page.locator('table').locator('tr');
  const rowCount = await tableRows.count();

  for(let i = 0; i < rowCount; i++){
    let row = await tableRows.nth(i);
    let columnCodIpa = await row.locator('td').nth(2).allInnerTexts();

    if (columnCodIpa == codIpa){
      await expect(row.locator('td').nth(1)).toContainText(nameEnte);
      await expect(row.locator('td').nth(4)).toContainText(status);
      if (withLogo) {
        await expect((row.locator('td').nth(0)).getByAltText('Immagine Ente')).toBeVisible();
      }
      checked = true;
    }
  }
  return checked;
}

When('inserisce i dati obbligatori relativi al nuovo Ente {} e clicca su Salva', enteId => insertNewEnte( enteId ))
Given('inserisce correttamente il nuovo Ente {}', async enteId => { 
  await clicksOn('Inserisci nuovo ente');
  await insertNewEnte( enteId );
  await checkToastMessage('Ente inserito correttamente');
})
async function insertNewEnte(enteId) {
  await page.getByRole('textBox', { name: 'Codice IPA'}).fill(codIpaPrefix + enteId);
  await page.getByRole('textBox', { name: 'Nome ente'}).fill(nameEntePrefix + enteId);
  await page.getByLabel('Codice tipo ente creditore *').locator('span').click();
  await page.getByRole('option', { name: 'SERVIZIO SANITARIO NAZIONALE'}).click();
  await page.getByRole('textBox', { name: 'Email ricezione notifiche'}).fill(emailEnte);
  await page.getByRole('textBox', { name: 'Codice segregazione'}).fill('0X');
  if(enteId == 'con codice fiscale non valido'){
    enteId = 'notValid';
  }
  await page.getByRole('textBox', { name: 'Codice fiscale ente'}).fill(enteInfo['fiscalCode'][enteId]);

  clicksOn('Salva');
  clicksOn('Conferma');
}

When('aggiunge il logo dell\'Ente {} e clicca su Modifica Logo', async function (enteId){
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#fileinput').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./config/file/ux_test_logo.png');
  clicksOn('Modifica Logo');
  clicksOn('Conferma');
})

Then('l\'Ente {} è presente nella lista con stato {word}', (enteId, status) => checkEnteInList(enteId, status))
Then('l\'Ente {} è presente nella lista con stato {word} e {}', (enteId, status, additionalInfo) => checkEnteInList(enteId, status, additionalInfo))
async function checkEnteInList(enteId, status, additionalInfo) {
  await page.getByRole('button', { name: 'Gestione enti' }).click();
  await page.getByRole('button', { name: 'Visualizza tutti gli enti' }).click();

  let withLogo = false;
  if( additionalInfo == 'con il logo') {
    withLogo = true;
  }
  const codIpa = codIpaPrefix + enteId;
  const nameEnte = nameEntePrefix + enteId;
  await expect(page.getByText( codIpa, { exact: true })).toBeVisible();
  expect(await checkDataEnteList( codIpa, nameEnte, status.toUpperCase(), withLogo )).toBeTruthy();
}

When('aggiunge altre informazioni relative all\'indirizzo dell\'Ente {} e clicca su Salva', async function(enteId) {
  await page.getByRole('textBox', { name: 'Denominazione'}).fill(codIpaPrefix + enteId);
  await page.getByRole('textBox', { name: 'Indirizzo'}).fill('Via Roma');
  await page.getByRole('textBox', { name: 'Civico'}).fill('1');
  await page.getByRole('textBox', { name: 'CAP'}).fill('00000');
  await page.getByLabel('Nazione', { exact: true }).locator('span').click();
  await page.getByRole('option', { name: 'ITALIA' }).click();
  await page.getByLabel('Provincia', { exact: true }).locator('span').click();
  await page.getByRole('option', { name: 'ROMA', exact: true }).click();
  await page.getByLabel('Località', { exact: true }).locator('span').click();
  await page.getByRole('option', { name: 'ROMA', exact: true }).click();

  clicksOn('Salva');
  clicksOn('Conferma');
})

When('cambia lo stato dell\'Ente {} in {} e clicca su Salva', async function(enteId, newValue) {
  await page.getByLabel('Stato *').locator('div').nth(2).click();
  await page.getByRole('option', { name: newValue.toUpperCase(), exact: true }).click();
  await page.getByLabel('Open calendar').click();
  const date = new Date(); 
  await page.getByText(date.getDate()).click();

  clicksOn('Salva');
  clicksOn('Conferma');
})