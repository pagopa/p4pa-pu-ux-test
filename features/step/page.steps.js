import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getEnteNameOfUser } from './login.steps.js';

Given('cliccando su {}', button => clicksButton(button))
Given('clicca su {}', button => clicksButton(button))
export async function clicksButton(button) {
  await page.getByRole('button', { name: button, exact: true }).click();
}

When('prova a cliccare su {}', async function (button) {
  context.latestButton = await page.getByRole('button', { name: button });
})

Given('nel dettaglio ente seleziona il tab {}', async function (tab) {
  await page.getByRole('tab', { name: tab, exact: true }).click();
})

Given('nel dettaglio ente tipo dovuto seleziona il tab {}', async function (tab) {
  await page.getByRole('tab', { name: tab, exact: true }).click();
})

Then('l\'utente vede l\'azione disabilitata', async function () {
  await expect(context.latestButton).toBeHidden();
})

Then('l\'azione {} risulta disabilitata', async function (button) {
  await expect(page.getByRole('button', { name: button })).toBeDisabled();
})

async function selectEnteToOperate() {
  const ente = await page.inputValue('#ente-input');
  if(ente != getEnteNameOfUser(context.userLogged)){
    await expect(page.getByRole('dialog')).toContainText('Selezionare un ente nell\'intestazione per abilitare le funzionalità');
    await page.locator('#mat-form-ente-field').click();
    await page.getByRole('option', { name: getEnteNameOfUser(context.userLogged) }).click();
  }
}

Given('entra nella sezione {string}', async function (section) {
  switch (section){
    case 'Gestione dovuti':
      await page.locator('#mat-card-action-dovuti').click();  
      await selectEnteToOperate();
      await expect(page.locator('#form-dovuti')).toBeVisible();
      break;
    default:
      console.log('Sezione non valida');
  }
})

Given('entra nella sezione {string} di {string}', async function (subSection, mainSection) {
  let idLocatorMainSection;
  let idLocatorSubSection;
  switch (mainSection){
    case 'Gestione flussi':
      idLocatorMainSection = '#mat-card-action-flussi'; break;
    case 'Back Office':
      idLocatorMainSection = '#mat-card-action-backoffice'; break;
    default: 
      console.log('Sezione non valida');
  }
  let locatorMainSection = await page.locator(idLocatorMainSection);
  await expect(locatorMainSection).toBeEnabled();
  await locatorMainSection.click();

  switch (subSection){
    case 'Gestione enti':
      idLocatorSubSection = '#mat-card-action-enti'; break;
    case 'Gestione tipi dovuto':
      idLocatorSubSection = '#mat-card-action-tipiDovuto'; break;
    case 'Importazione flussi':
      idLocatorSubSection = '#mat-card-action-flussi-import'; break;
    case 'Flussi RT':
      idLocatorSubSection = '#mat-card-action-flussi-export'; break;
    default: 
      console.log('Sezione non valida');
  }
  let locatorSubSection = await page.locator(idLocatorSubSection);
  await expect(locatorSubSection).toBeEnabled();
  await locatorSubSection.click();
})

Then('l\'utente visualizza l\'errore in pagina {string}', async function (errore) {
  await expect(page.getByText(errore)).toBeVisible(); 
})

Then('l\'utente visualizza il messaggio di {string}', message => checkToastMessage(message)) 
export async function checkToastMessage(message) {
  const toast = await page.getByRole('alert');
  await expect(toast).toContainText(message);
  await toast.click();
}

Then('l\'utente visualizza l\'avviso di {string}', async function (alertMessage) {
  let idLocatorError;
  switch (alertMessage) {
    case 'Email non valida':
      idLocatorError = '#mat-error-emailAmministratore';
  }
  await expect(page.locator(idLocatorError)).toContainText(alertMessage);
})

Then('l\'utente nella casella {string} visualizza l\'avviso di {string}', async function (textbox, alertMessage) {
  let idLocatorError;
  switch (textbox) {
    case 'Descrizione tipo dovuto':
      idLocatorError = '#mat-error-deTipo';
    case 'Anagrafica':
      idLocatorError = '#mat-error-anagrafica';
  }
  await expect(page.locator(idLocatorError)).toContainText(alertMessage);
})

export async function removeToastAuthError() {
  // To avoid an alert for authentication problem
  await checkToastMessage('Dati non validi: Bad Access Token provided');
  await clicksButton('Close');
}

When('tra le azioni disponibili clicca su {}', action => buttonActions(action))
export async function buttonActions(action) {
  await page.locator('table').locator('tr').nth(1).locator('#button-actions').click();
  if(action == 'Scarica avviso'){
    context.downloadPromise = page.waitForEvent('download');
  }
  await clicksButton(action);
}

When('spunta la casella {}', async function (checkboxName) {
  await expect(page.getByRole('checkbox', { name: checkboxName, exact: true})).not.toBeChecked();
  await page.getByRole('checkbox', { name: checkboxName, exact: true}).check();
})

Then('la casella {} risulta spuntata di default e non modificabile', async function (checkboxName) {
  await expect(page.getByRole('checkbox', { name: checkboxName, exact: true})).toBeChecked();
  await expect(page.getByRole('checkbox', { name: checkboxName, exact: true})).toBeDisabled();
})