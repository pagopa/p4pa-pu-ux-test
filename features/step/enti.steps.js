import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const codIpaPrefix = 'UX_TEST_';
const nameEntePrefix = 'Ente UX Test ';
const emailEnte = 'enteuxtest@email.it';

async function checkDataEnteList(codIpa, nameEnte, status) {
  let checked = false;
  let tableRows = await page.locator('table').locator('tr');
  const rowCount = await tableRows.count();

  for(let i = 0; i < rowCount; i++){
    let row = await tableRows.nth(i);
    let columnCodIpa = await row.locator('td').nth(2).allInnerTexts();

    if (columnCodIpa == codIpa){
      await expect(row.locator('td').nth(1)).toContainText(nameEnte);
      await expect(row.locator('td').nth(4)).toContainText(status);
      checked = true;
    }
  }
  return checked;
}

When('inserisce i dati obbligatori relativi al nuovo Ente {} e clicca su Salva', async function (enteId) {
  await page.getByRole('textBox', { name: 'Codice IPA'}).fill(codIpaPrefix + enteId);
  await page.getByRole('textBox', { name: 'Nome ente'}).fill(nameEntePrefix + enteId);
  await page.getByLabel('Codice tipo ente creditore *').locator('span').click();
  await page.getByText('COMUNE/UNIONE DI COMUNI', { exact: true }).click();
  await page.getByRole('textBox', { name: 'Email ricezione notifiche'}).fill(emailEnte);
  await page.getByRole('textBox', { name: 'Codice segregazione'}).fill('0X');
  await page.getByRole('textBox', { name: 'Codice fiscale ente'}).fill('21150100580');

  await page.getByRole('button', { name: 'Salva' }).click();
  await page.getByRole('button', { name: 'Conferma' }).click();
})

Then('l\'utente visualizza l\'Ente {} nella lista', async function (enteId) {
  await page.getByRole('button', { name: 'Visualizza tutti gli enti' }).click();

  if (enteId == 'Demo'){
    await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
    expect(await checkDataEnteList( 'DEMO', 'Ente demo P4PA', 'ESERCIZIO' )).toBeTruthy();
  } else {
    const codIpa = codIpaPrefix + enteId;
    const nameEnte = nameEntePrefix + enteId;
    await expect(page.getByText( codIpa, { exact: true })).toBeVisible();
    expect(await checkDataEnteList( codIpa, nameEnte, 'INSERITO' )).toBeTruthy();
  }
})

Then('il nuovo Ente {} viene inserito correttamente', async function (ente) {
  await expect(page.getByText('Ente inserito correttamente.')).toBeVisible();
  await page.getByRole('button', { name: 'Gestione enti' }).click();
})