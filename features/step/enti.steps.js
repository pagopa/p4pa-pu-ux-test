import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { enteInfo } from '../../config/config.mjs';

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
Given('dopo aver inserito correttamente il nuovo Ente {} cliccando su Salva', enteId => insertNewEnte ( enteId ))
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

  await page.getByRole('button', { name: 'Salva' }).click();
  await page.getByRole('button', { name: 'Conferma' }).click();
}

Then('il nuovo Ente {} viene inserito correttamente', async function (enteId) {
  await expect(page.getByText('Ente inserito correttamente.')).toBeVisible();
})

Then('l\'utente vede la funzionalità disabilitata', async function () {
  await expect(context.latestButton).toBeHidden();
})

Then('l\'utente visualizza l\'errore in pagina {string}', async function (errore) {
  await expect(page.getByText(errore)).toBeVisible(); 
})

When('aggiunge il logo dell\'Ente {} e clicca su Modifica Logo', async function (enteId){
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#fileinput').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./config/file/ux_test_logo.png');
  await page.getByRole('button', { name: 'Modifica Logo' }).click();
  await page.getByRole('button', { name: 'Conferma' }).click();
})

Then('il logo per l\'Ente {} è aggiornato correttamente', async function (enteId) {
  await expect(page.getByText('logo aggiornato correttamente')).toBeVisible();
})

Then('l\'utente visualizza l\'Ente {} nella lista', enteId => visualizeEnteList(enteId))
Then('l\'utente visualizza l\'Ente {} nella lista {}', (enteId, additionalInfo) => visualizeEnteList(enteId, additionalInfo))
async function visualizeEnteList(enteId, additionalInfo) {
  await page.getByRole('button', { name: 'Gestione enti' }).click();
  await page.getByRole('button', { name: 'Visualizza tutti gli enti' }).click();

  let withLogo = false;
  if( additionalInfo == 'con il logo') {
    withLogo = true;
  }
  const codIpa = codIpaPrefix + enteId;
  const nameEnte = nameEntePrefix + enteId;
  await expect(page.getByText( codIpa, { exact: true })).toBeVisible();
  expect(await checkDataEnteList( codIpa, nameEnte, 'INSERITO', withLogo )).toBeTruthy();
}
