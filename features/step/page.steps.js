import { Given } from '@cucumber/cucumber';

Given('clicks on {}', button => clicksButton(button))
export async function clicksButton(button) {
  await page.getByRole('button', { name: button, exact: true }).click();
}
