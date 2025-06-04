import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { getItTranslation } from '../../utils/translations.js';

Given('clicks on {}', button => clickButton(button))
export async function clickButton(button) {
  await page.getByRole('button', { name: getItTranslation(button), exact: true }).click();
}

Given('enters the {string} section on the menu', section => enterSection(section))
export async function enterSection(section) {
  await page.getByRole('link', { name: getItTranslation(section), exact: true }).click();
}

Given('enters the {string} section on the menu and clicks on {string}', async (section, button) => {
  await enterSection(section);
  await clickButton(button);
})

export async function checkHeading(heading) {
  await expect(page.getByRole('heading',  { name: getItTranslation(heading), exact: true })).toBeVisible();
}


Then('the message {string} appears', async (message) => {
  var heading = message;
  var button = null;
  if(message == 'Debt position is been created'){
    heading = getItTranslation(message, { description: context.debtPosition.description });
    button = "Back to start";
  }
  await checkHeading(heading);
  if (button != null) {
    await clickButton(button);
  }
})