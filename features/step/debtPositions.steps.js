import { When } from "@cucumber/cucumber";
import { getItTranslation } from "../../utils/translations.js";
import { checkHeading, clickButton } from "./page.steps.js";
import { citizenInfo } from "../../config/config.mjs";
import { firstOfNextMonth } from "../../utils/utility.js";

const debtPositionTypeOrg = 'UX TEST';

async function insertDebtPositionData(){
    const now = new Date();
    const debtPositionDescription = 'Test ux - ' + now.toLocaleString().replace(/\//g, '');

    await page.getByRole('combobox', { name: getItTranslation('Debt position type org') }).click();
    await page.getByRole('option', { name: debtPositionTypeOrg }).click();
    await page.getByRole('textbox', { name: getItTranslation('Debt position description')}).fill(debtPositionDescription);

    context.debtPositionDescription = debtPositionDescription;
}

async function insertDebtorData() {
    await page.getByRole('combobox', { name: getItTranslation('Person entity type') }).click();
    await page.getByRole('option', { name: getItTranslation('F')}).click();
    await page.getByRole('textbox', { name: getItTranslation('Fiscal code') }).fill(citizenInfo.fiscalCode);
    await page.getByRole('textbox', { name: getItTranslation('Full name') }).fill(citizenInfo.name);
    await page.getByRole('textbox', { name: getItTranslation('Address') }).fill("Via del test");
    await page.getByRole('textbox', { name: getItTranslation('Civic') }).fill("1");
    await page.getByRole('textbox', { name: getItTranslation('Postal code') }).fill("00000");
    await page.getByRole('combobox', { name: getItTranslation('Province') }).click();
    await page.getByRole('option', { name: "MI"}).click();
    await page.getByRole('textbox', { name: getItTranslation('Location') }).fill("Milano");
}

async function insertSingleInstallmentData(amount) {
    await page.getByRole('textbox', { name: getItTranslation('Remittance information') }).fill("Test ux single installment");
    await page.getByRole('combobox', { name: getItTranslation('Payment option type') }).click();
    await page.getByRole('option', { name: getItTranslation('Single installment')}).click();
    await page.getByRole('textbox', { name: getItTranslation('Amount') }).fill(amount);
    await page.getByRole('textbox', { name: getItTranslation('Due date') }).fill(firstOfNextMonth());
}

When('inserts correctly a debt position with payment option having single installment of {} euros and clicks on {string}', async function (amount, button) {
    await checkHeading('Create a new debt position');
    await checkHeading('General configuration');
    await insertDebtPositionData();
    await clickButton('Continue');
    await checkHeading('Add debtor');
    await insertDebtorData();
    await clickButton('Continue');
    await checkHeading('Notice configuration');
    await insertSingleInstallmentData(amount);
    await clickButton(button);
})