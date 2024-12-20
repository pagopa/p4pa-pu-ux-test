const { BeforeAll, Before, AfterAll, After, Status, setDefaultTimeout } = require ('@cucumber/cucumber');
const { chromium } = require('playwright');

const options = {
  headless: true,
  slowMo: 300
};

setDefaultTimeout(180000);

// Create a global browser for the test session.
BeforeAll(async () => {
  global.browser = await chromium.launch(options);
});

AfterAll(async () => {
  await global.browser.close();
});

// Create a fresh browser context for each test.
Before(async () => {
  global.context = await global.browser.newContext({ locale: 'it-IT'});
  global.page = await global.context.newPage();
});

// close the page and context after each test.
After(async () => {
  await global.page.close();
  await global.context.close();
});


After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    let buffer = await global.page.screenshot(
      { 
        path: `report/screenshots/${scenario.pickle.name}.png`,
        fullPage: true
      })
    this.attach(buffer, 'image/png');
  }
});