import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { enteInfo } from '../../config/config.mjs';
import { clicksButton, checkToastMessage } from './page.steps.js';

const codIpaPrefix = 'UX_TEST_';
const nameEntePrefix = 'Ente UX Test ';
const emailEnte = 'enteuxtest@email.it';

async function getEnteFromList(codIpa) {
  let nextPageExists = false;
  expect(page.locator('table')).toBeVisible();
  await page.mouse.down();
  
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
  await page.locator('#input-codIpaEnte').fill(codIpaPrefix + enteId);
  await page.locator('#input-deNomeEnte').fill(nameEntePrefix + enteId);
  await page.locator('#mat-select-codTipoEnte').click();
  await page.getByRole('option', { name: 'SERVIZIO SANITARIO NAZIONALE'}).click();
  await page.locator('#input-emailAmministratore').fill(emailEnte);
  await page.locator('#input-applicationCode').fill('0X');
  if(enteId == 'con codice fiscale non valido'){
    enteId = 'notValid';
  }
  await page.locator('#input-codiceFiscaleEnte').fill(enteInfo['fiscalCode'][enteId]);

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
  await clicksButton('Gestione enti');
  await clicksButton('Visualizza tutti gli enti');

  const codIpa = codIpaPrefix + enteId;
  const nameEnte = nameEntePrefix + enteId;

  let rowEnte = await getEnteFromList(codIpa);
  await expect(rowEnte.locator('td').nth(1)).toContainText(nameEnte);
  await expect(rowEnte.locator('td').nth(4)).toContainText(status.toUpperCase());

  if( additionalInfo == 'con il logo') {
    await expect((rowEnte.locator('td').nth(0)).getByAltText('Immagine Ente')).toBeVisible();  
  }
}

When('aggiunge altre informazioni relative all\'indirizzo dell\'Ente {word} e clicca su Salva', async function(enteId) {
  await page.locator('#input-deRpEnteBenefDenominazioneBeneficiario').fill(codIpaPrefix + enteId);
  await page.locator('#input-deRpEnteBenefIndirizzoBeneficiario').fill('Via Roma');
  await page.locator('#input-deRpEnteBenefCivicoBeneficiario').fill('1');
  await page.locator('#input-codRpEnteBenefCapBeneficiario').fill('00000');
  await page.locator('#mat-select-nazione').click();
  await page.getByRole('option', { name: 'ITALIA' }).click();
  await page.locator('#mat-select-prov').click();
  await page.getByRole('option', { name: 'ROMA', exact: true }).click();
  await page.locator('#mat-select-comune').click();
  await page.getByRole('option', { name: 'ROMA', exact: true }).click();

  await clicksButton('Salva');
  await clicksButton('Conferma');
})

When('cambia lo stato dell\'Ente {word} in {} e clicca su Salva', async function(enteId, newValue) {
  await page.locator('#mat-select-cdstatoente').click();
  await page.getByRole('option', { name: newValue.toUpperCase(), exact: true }).click();

  await clicksButton('Salva');
  await clicksButton('Conferma');
})

When('prova a cambiare l\'email dell\'Ente in {string}', async function( newValue) {
  await page.locator('#input-emailAmministratore').fill(newValue);
  await page.mouse.down();
})


Given('ricerca l\'Ente {word} nella lista per visualizzarne il dettaglio', async function(enteId) {
  const codIpa = codIpaPrefix + enteId;
  await page.locator('#input-codiceIPA').fill(codIpa);
  await clicksButton('Cerca');
  await expect(page.getByText( codIpa, { exact: true })).toBeVisible();
  await page.locator('table').locator('tr').nth(1).locator('#button-actions').click();
  await page.locator('#button-menu-detail').click();
  // To avoid an alert for authentication problem
  await checkToastMessage('Dati non validi: Bad Access Token provided');
  await clicksButton('Close');
})

async function getFunctionality(functionality){
  expect(page.locator('table')).toBeVisible();
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

