import { Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { userInfo } from '../../config/config.mjs';

const adminGlobal = userInfo.adminGlobal;
const adminEnte = userInfo.adminEnte;
const operator = userInfo.operator;

async function newPage() {
    await global.page.goto(global.baseUrl);
    await global.page.getByRole('button', { name: 'Salva le mie preferenze' }).click();
    await global.page.getByRole('button', { name: 'Accedi' }).click();
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
    await global.page.getByRole('textbox', { name: 'ID utente' }).fill(userId);
    await global.page.getByRole('textbox', { name: 'Password' }).fill(password);
}

Given('l\'utente {} che effettua la login', async function (user) {
    await newPage();
    await insertCredential(user);
    await global.page.getByRole('button', { name: 'Accedi' }).click();
    const nameRegistry = getNameOfUser(user);
    await expect(global.page.getByText('Autenticato come ' + nameRegistry)).toBeVisible();

    const gestioneFlussi = global.page.getByRole('link', { name: 'Gestione flussi' }).nth(1);
    const gestioneDovuti = global.page.getByRole('link', { name: 'Gestione dovuti' }).nth(1);

    await expect(gestioneFlussi).toBeVisible();
    await expect(gestioneDovuti).toBeVisible();

    const backOffice = global.page.getByRole('link', { name: 'Back office' }).nth(1);
    if (user != 'Operatore') {
        await expect(backOffice).toBeVisible();   
    } else {
        await expect(backOffice).not.toBeVisible();
    }
})