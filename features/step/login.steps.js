import { Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { userInfo, pageUrl } from '../../config/config.mjs';
import { clickButton } from './page.steps.js';
import { getItTranslation } from '../../utils/translations.js';

async function newPage() {
    await page.goto(pageUrl);
    await page.locator('#spidButton').click();
    await page.getByTestId('idp-button-https://validator.dev.oneid.pagopa.it/demo').click();
}

async function insertCredential(orgName, admin) {
    var username;
    let password = userInfo.password;
    if (orgName == 'Ente P4PA intermediato 2' && admin) {
        username = userInfo.adminIntermediato2.username;
    } else if (orgName == 'Ente locale' && admin) {
        username = userInfo.adminEnteLocale.username;
    } else {
        console.log('User not valid');
    }
    await page.fill('#username', username);
    await page.fill('#password', password);
    await clickButton('Entra con SPID')
    await clickButton(getItTranslation('Confirm'));
}


async function selectOrgForLogin(orgName) {
    await expect(page.getByRole('heading', { name: getItTranslation('Select your organization') })).toBeVisible({ timeout: 20000 });

    let accediDisabled = await page.getByRole('button', { name: getItTranslation('Sign in') }).isDisabled();
    if (accediDisabled) {
        await page.getByRole('button', { name: orgName }).click();
    }
    await clickButton(getItTranslation('Sign in'));
}

Given('the admin user of {} logs in', async function (orgName) {
    await newPage();
    await insertCredential(orgName, true);
    await selectOrgForLogin(orgName);

    const puLocator = await page.locator('#forward_prod-piattaforma-unitaria');
    await expect(puLocator).toBeVisible({ timeout: 5000 });
    await puLocator.click();

    await expect(page.getByRole('heading', { name: orgName })).toBeVisible();
})
