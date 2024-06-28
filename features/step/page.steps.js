import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('cliccando su {}', button => clicksOn(button))
Given('clicca su {}', button => clicksOn(button))
export async function clicksOn(button) {
  await page.getByRole('button', { name: button, exact: true }).click();
}

When('prova a cliccare su {}', async function (button) {
  context.latestButton = await page.getByRole('button', { name: button });
})

Then('l\'utente vede l\'azione disabilitata', async function () {
  await expect(context.latestButton).toBeHidden();
})

Given('entra nella sezione {} di {}', async function (subSection, mainSection) {
  let linkMainSection = page.getByRole('link', { name: mainSection }).nth(1);
  await expect(linkMainSection).toBeEnabled();
  await linkMainSection.click();
  let linkSubSection = page.getByRole('link', { name: subSection }).nth(1);
  await expect(linkSubSection).toBeEnabled();
  await linkSubSection.click();
})

Then('l\'utente visualizza l\'errore in pagina {string}', async function (errore) {
  await expect(page.getByText(errore)).toBeVisible(); 
})

Then('l\'utente visualizza il messaggio di {string}', message => checkToastMessage(message)) 
export async function checkToastMessage(message) {
  await expect(page.getByText(message)).toBeVisible()
}