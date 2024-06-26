import { Given, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('cliccando su {}', async function (button) {
  await page.getByRole('button', { name: button }).click();
})

When('clicca su {}', async function (button) {
  await page.getByRole('button', { name: button }).click();
})

When('prova a cliccare su {}', async function (button) {
  context.latestButton = await page.getByRole('button', { name: button });
})

Given('entra nella sezione {} di {}', async function (subSection, mainSection) {
  let linkMainSection = page.getByRole('link', { name: mainSection }).nth(1);
  await expect(linkMainSection).toBeEnabled();
  await linkMainSection.click();
  let linkSubSection = page.getByRole('link', { name: subSection }).nth(1);
  await expect(linkSubSection).toBeEnabled();
  await linkSubSection.click();
})
