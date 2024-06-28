import { Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { userInfo } from '../../config/config.mjs';
import { clicksOn, checkToastMessage } from './page.steps.js';

const adminGlobal = userInfo.adminGlobal;
const adminEnte = userInfo.adminEnte;
const operator = userInfo.operator;

async function newPage() {
    await page.goto(global.baseUrl);
    await clicksOn('Accetta tutti');
    await clicksOn('Entra con SPID');
    await page.getByLabel('test').click();
}

function getNameOfUser (user) {
    var name;
    if ( user == 'Amministratore Globale') {
        name = adminGlobal.name;
    } else if ( user == 'Amministratore Ente') {
        name = adminEnte.name;
    } else if (user == 'Operatore') { 
        name = operator.name;
    } else {
        console.log('Utente non valido');
    }
    return name;
}

function getEnteNameOfUser (user) {
    var name;
    if ( user == 'Amministratore Globale') {
        name = adminGlobal.enteName;
    } else if ( user == 'Amministratore Ente') {
        name = adminEnte.enteName;
    } else if (user == 'Operatore') { 
        name = operator.enteName;
    } else {
        console.log('Utente non valido');
    }
    return name;
}

async function insertCredential(user) {
    var userId;
    var password;
    if ( user == 'Amministratore Globale') {
        userId = adminGlobal.userId;
        password = adminGlobal.password;
    } else if ( user == 'Amministratore Ente') {
        userId = adminEnte.userId;
        password = adminEnte.password;
    } else if (user == 'Operatore') { 
        userId = operator.userId;
        password = operator.password;
    } else {
        console.log('Utente non valido');
    }
    await page.getByRole('textbox', { name: 'Username' }).fill(userId);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await clicksOn('Invia');
    await clicksOn('Invia');
}

async function selectEnte(user) {
    await expect(page.getByRole('heading', { name: 'Seleziona il tuo ente' })).toBeVisible({ timeout: 5000 });

    let accediDisabled = await page.getByRole('button', { name: 'Accedi' }).isDisabled();
    if (accediDisabled) {
        const enteName = getEnteNameOfUser(user);
        await clicksOn(enteName);
    } 
    await clicksOn('Accedi');
}

Given('l\'utente {} che effettua la login', async function (user) {
    await newPage();
    await insertCredential(user);
    await selectEnte(user);
    
    const puLocator = await page.locator('#forward_prod-piattaforma-unitaria');
    await expect(puLocator).toBeVisible({ timeout: 5000 });
    await puLocator.click();
    await clicksOn('Salva le mie preferenze');

    const nameRegistry = getNameOfUser(user);
    await checkToastMessage('Autenticato come ' + nameRegistry);

    const gestioneFlussi = page.getByRole('link', { name: 'Gestione flussi' }).nth(1);
    const gestioneDovuti = page.getByRole('link', { name: 'Gestione dovuti' }).nth(1);

    await expect(gestioneFlussi).toBeVisible();
    await expect(gestioneDovuti).toBeVisible();

    const backOffice = page.getByRole('link', { name: 'Back office' }).nth(1);
    if (user != 'Operatore') {
        await expect(backOffice).toBeVisible();   
    } else {
        await expect(backOffice).not.toBeVisible();
    }
})