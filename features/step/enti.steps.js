import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('l\'utente visualizza l\'Ente {}', async function (ente) {
  await expect(page.getByRole('table', { name: 'tabella'})).toBeVisible();
  await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
})
