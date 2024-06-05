import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('l\'utente che clicca su {word}', async function (button) {
    await page.getByRole('button', { name: button }).click();
})

When('l\'utente clicca su {}', async function (button) {
  await page.getByRole('button', { name: button }).click();
})

Given('l\'utente che entra nella sezione {} di {}', async function (subSection, mainSection) {
  let linkMainSection = page.getByRole('link', { name: mainSection }).nth(1);
  await expect(linkMainSection).toBeEnabled();
  await linkMainSection.click();
  let linkSubSection = page.getByRole('link', { name: subSection }).nth(1);
  await expect(linkSubSection).toBeEnabled();
  await linkSubSection.click();
})
