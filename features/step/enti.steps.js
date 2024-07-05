import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { enteInfo } from '../../config/config.mjs';
import { clicksButton, checkToastMessage } from './page.steps.js';

const codIpaPrefix = 'UX_TEST_';
const nameEntePrefix = 'Ente UX Test ';
const emailEnte = 'enteuxtest@email.it';

async function getEnteFromList(codIpa) {
  let nextPageExists = false;

  do {
    let tableRows = await page.locator('table').locator('tr');
    let rowCount = await tableRows.count();

    for(let i = 0; i < rowCount; i++){
      let row = await tableRows.nth(i);
      let columnCodIpa = await row.locator('td').nth(2).allInnerTexts();
      if (columnCodIpa == codIpa){
        return row;
      }
    }

    if (await page.getByRole('button', { name: 'Pagina successiva', exact: true }).isVisible()){
      nextPageExists = true;
      await page.getByRole('button', { name: 'Pagina successiva', exact: true }).click();
    }
  } while (nextPageExists);
}

When('inserisce i dati obbligatori relativi al nuovo Ente {} e clicca su Salva', enteId => insertNewEnte( enteId ))
Given('inserisce correttamente il nuovo Ente {word}', async enteId => { 
  await clicksButton('Inserisci nuovo ente');
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

  clicksButton('Salva');
  clicksButton('Conferma');
}

When('aggiunge il logo dell\'Ente {word} e clicca su Modifica Logo', async function (enteId){
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#fileinput').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./config/file/ux_test_logo.png');
  clicksButton('Modifica Logo');
  clicksButton('Conferma');
})

Then('l\'Ente {word} è presente nella lista con stato {word}', (enteId, status) => checkEnteInList(enteId, status))
Then('l\'Ente {word} è presente nella lista con stato {word} e {}', (enteId, status, additionalInfo) => checkEnteInList(enteId, status, additionalInfo))
async function checkEnteInList(enteId, status, additionalInfo) {
  clicksButton('Gestione enti');
  clicksButton('Visualizza tutti gli enti');

  const codIpa = codIpaPrefix + enteId;
  const nameEnte = nameEntePrefix + enteId;
  await expect(page.getByText( codIpa, { exact: true })).toBeVisible();

  let rowEnte = await getEnteFromList(codIpa);
  await expect(rowEnte.locator('td').nth(1)).toContainText(nameEnte);
  await expect(rowEnte.locator('td').nth(4)).toContainText(status.toUpperCase());

  if( additionalInfo == 'con il logo') {
    await expect((rowEnte.locator('td').nth(0)).getByAltText('Immagine Ente')).toBeVisible();  
  }
}

When('aggiunge altre informazioni relative all\'indirizzo dell\'Ente {word} e clicca su Salva', async function(enteId) {
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

  clicksButton('Salva');
  clicksButton('Conferma');
})

When('cambia lo stato dell\'Ente {word} in {} e clicca su Salva', async function(enteId, newValue) {
  await page.getByLabel('Stato *').locator('div').nth(2).click();
  await page.getByRole('option', { name: newValue.toUpperCase(), exact: true }).click();

  clicksButton('Salva');
  clicksButton('Conferma');
})

When('prova a cambiare l\'email dell\'Ente in {string}', async function( newValue) {
  await page.getByRole('textBox', { name: 'Email ricezione notifiche'}).fill(newValue);
  await page.mouse.down();
})


Given('ricerca l\'Ente {word} nella lista per visualizzarne il dettaglio', async function(enteId) {
  const codIpa = codIpaPrefix + enteId;
  await page.getByRole('textBox', { name: 'Codice IPA'}).fill(codIpa);
  await clicksButton('Cerca');
  await expect(page.getByText( codIpa, { exact: true })).toBeVisible();
  await page.locator('table').locator('tr').nth(1).getByRole('button', { name: 'Azioni disponibili' }).click();
  await clicksButton('Visualizza dettaglio');
})

async function getFunctionality(functionality){
  let tableRows = await page.locator('table').locator('tr');
  let rowCount = await tableRows.count(); 

  for(let i = 0; i < rowCount; i++){
    let row = await tableRows.nth(i);
    let columnCodFunctionality = await row.locator('td').nth(0).allInnerTexts();
    if (columnCodFunctionality == functionality){
      return row;
    }
  }
}

When('{} la funzionalità di {}', async function(action, functionality) {
  functionality = functionality.toUpperCase().replace(' ', '_');
  action = action.charAt(0).toUpperCase() + action.slice(1);
  const previousStatus = action == 'Abilita' ? 'Disabilitato' : 'Abilitato';
  const rowFunctionality = await getFunctionality(functionality);
  await expect(rowFunctionality.locator('td').nth(1)).toContainText(previousStatus);

  await rowFunctionality.getByRole('button', { name: 'Azioni disponibili' }).click();
  clicksButton(action + ' funzionalità');
  clicksButton('Conferma');
})

Then('la funzionalità di {} risulta in stato {word}', async function(functionality, status) {
  functionality = functionality.toUpperCase().replace(' ', '_');
  status = status.charAt(0).toUpperCase() + status.slice(1);
  const previousStatus = status == 'Abilitato' ? 'Disabilitato': 'Abilitato';
  const rowFunctionality = await getFunctionality(functionality);
  await expect(rowFunctionality.locator('td').nth(1)).toContainText(status);

  await rowFunctionality.getByRole('button', { name: 'Azioni disponibili' }).click();
  clicksButton('Registro cambio stato');
  const dialog = await page.getByRole( 'dialog', { name: 'Registro cambio stato abilitazione - Funzionalità: '+ functionality});

  const tableFirstRow = await dialog.locator('table').locator('tr').nth(1);
  await expect(tableFirstRow.locator('td').nth(3)).toContainText(previousStatus);
  await expect(tableFirstRow.locator('td').nth(4)).toContainText(status);
  await expect(tableFirstRow.locator('td').nth(2)).toContainText(new Date().toLocaleDateString('it-IT'));
})

