import { When, Then } from "@cucumber/cucumber";
import { getItTranslation } from "../../utils/translations.js";
import { checkHeading, clickButton } from "./page.steps.js";
import { citizenInfo } from "../../config/config.mjs";
import { firstOfNextMonth, getToday } from "../../utils/utility.js";
import { expect } from '@playwright/test';

const debtPositionTypeOrg = 'UX TEST';

async function insertDebtPositionData(){
    const now = new Date();
    const debtPositionDescription = 'Test ux - ' + now.toLocaleString().replace(/\//g, '');

    await page.getByRole('combobox', { name: getItTranslation('Type of debt position') }).click();
    await page.getByRole('option', { name: debtPositionTypeOrg }).click();
    await page.getByRole('textbox', { name: getItTranslation('Debt position description')}).fill(debtPositionDescription);

    context.debtPosition = {
        "description": debtPositionDescription
    }
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
    const remittanceInformation = "Test ux single installment";
    await page.getByRole('textbox', { name: getItTranslation('Remittance information') }).fill(remittanceInformation);
    await page.getByRole('combobox', { name: getItTranslation('Payment option type') }).click();
    await page.getByRole('option', { name: getItTranslation('Single installment')}).click();
    await page.getByRole('textbox', { name: getItTranslation('Amount') }).fill(amount);
    await page.getByRole('textbox', { name: getItTranslation('Due date') }).fill(firstOfNextMonth());

    context.debtPosition["paymentOption"] = {
        "type": "Single installment",
        "installments": [
            {
                "amount": amount,
                "dueDate": firstOfNextMonth(),
                "remittanceInformation": remittanceInformation
            }
        ]
    }
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


When('in the search section in tab {string} filters by fiscal code, debt position type and status {string}', async function (tab, status) {
    await checkHeading('What are you looking for?');
    await page.getByRole('tab', { name: getItTranslation(tab) }).click();
    await page.getByRole('textbox', { name: getItTranslation('Search fiscal code') }).fill(citizenInfo.fiscalCode);
    await page.getByRole('textbox', { name: getItTranslation('Creation from') }).fill(getToday());
    await page.getByRole('textbox', { name: getItTranslation('To') , exact: true }).fill(getToday());
    await page.getByRole('combobox', { name: getItTranslation('Debt position type org') }).click();
    await page.getByRole('option', { name: debtPositionTypeOrg }).click();
    await page.getByRole('combobox', { name: getItTranslation('Status') }).click();
    await page.getByRole('option', { name: getItTranslation(status) }).click();
    await clickButton(getItTranslation('Filter'));
})

Then('the new debt position is present in the list in status {string}', async function (status) {
    const results = page.locator('[aria-label="results-table"]');
    await expect(results).toBeVisible();

    const firstRow = page.locator('[data-rowindex="0"]');
    await expect(firstRow).toBeVisible();

    await expect(firstRow.locator('[data-field="description"]').first()).toHaveText(context.debtPosition.description);
    await expect(firstRow.locator('[data-field="debtPositionTypeOrgDescription"]').first()).toHaveText(debtPositionTypeOrg);
    await expect(firstRow.locator('[data-field="creationDate"]').first()).toHaveText(getToday());
    await expect(firstRow.locator('[data-field="status"]').first()).toHaveText(getItTranslation(status));

})

Then('by clicking on action icon, the debt position details are visible', async function () {
    const debtPosition = context.debtPosition;

    const actionIcon = page.locator('[data-rowindex="0"]').locator('[data-field="action"] svg[data-testid="ChevronRightIcon"]');
    await expect(actionIcon).toBeEnabled();
    await actionIcon.click();

    await expect(page.getByTestId('DownloadButton')).toBeEnabled();
    await expect(page.getByTestId('HistoryButton')).toBeEnabled();
    await expect(page.getByTestId('MoreVertIcon')).toBeEnabled();

    await expect(page.getByRole('heading', { name: debtPosition.description, exact: true })).toBeVisible();

    await clickButton('Info on debt position');
    
    const detail = page.locator('#debt-position-detail').locator('.MuiGrid-container.MuiGrid-spacing-xs-1');

    await expect(detail.nth(0).locator('p').nth(0)).toHaveText(getItTranslation('Debtor'));
    await expect(detail.nth(0).locator('p').nth(1)).toHaveText(citizenInfo.name);
    await expect(detail.nth(1).locator('p').nth(0)).toHaveText(getItTranslation('Fiscal code / P. IVA'));
    await expect(detail.nth(1).locator('p').nth(1)).toHaveText(citizenInfo.fiscalCode + ' (Persona fisica)');
    await expect(detail.nth(2).locator('p').nth(0)).toHaveText(getItTranslation('Debt position type org'));
    await expect(detail.nth(2).locator('p').nth(1)).toHaveText(debtPositionTypeOrg);
    await expect(detail.nth(3).locator('p').nth(0)).toHaveText(getItTranslation('Iupd org'));
    await expect(detail.nth(3).locator('p').nth(1)).not.toBeNull();

    await expect(page.getByRole('heading', { name: getItTranslation('Single Installment') })).toBeVisible();

    await clickButton('Detail on payment option');

    const paymentDetail = page.locator('#payment-detail').locator('.MuiGrid-container.MuiGrid-spacing-xs-1');
    const installment = debtPosition.paymentOption.installments[0]; //TODO fixme

    await expect(paymentDetail.nth(0).locator('p').nth(0)).toHaveText(getItTranslation('Description'));
    await expect(paymentDetail.nth(0).locator('p').nth(1)).toHaveText(getItTranslation(debtPosition.paymentOption.type));
    await expect(paymentDetail.nth(1).locator('p').nth(0)).toHaveText(getItTranslation('Amount'));
    await expect(paymentDetail.nth(1).locator('p').nth(1)).toHaveText(installment.amount.toString() + ' €');

    const installments = page.locator('[role="grid"]');

    const firstInstallment = installments.locator('[data-rowindex="0"]');
    await expect(firstInstallment.locator('[data-field="iuv"]')).not.toBeNull();
    await expect(firstInstallment.locator('[data-field="subject"]')).toHaveText(debtPosition.paymentOption.installments[0].remittanceInformation);
    await expect(firstInstallment.locator('[data-field="amount"]')).toHaveText(installment.amount.toString() + ' €');
    await expect(firstInstallment.locator('[data-field="expirationDate"]')).toHaveText(installment.dueDate);
    await expect(firstInstallment.locator('[data-field="status"]')).toHaveText(getItTranslation('Unpaid'));

    //Delete debt position
    await page.getByTestId('MoreVertIcon').click();
    await page.getByTestId('DeleteIcon').click();
    await clickButton('Delete');
});
