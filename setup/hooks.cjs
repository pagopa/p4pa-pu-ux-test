const { BeforeAll, Before, AfterAll, After, Status } = require ('@cucumber/cucumber');
const { chromium } = require('playwright');

const options = {
  headless: true,
  slowMo: 100
};

global.baseUrl = 'https://payhub.dev.p4pa.pagopa.it/myoperatore/home';

// Create a global browser for the test session.
BeforeAll(async () => {
  global.browser = await chromium.launch(options);
});

AfterAll(async () => {
  await global.browser.close();
});

// Create a fresh browser context for each test.
Before(async () => {
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();
});

// close the page and context after each test.
After(async () => {
  await global.page.close();
  await global.context.close();
});


After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    var buffer = await global.page.screenshot({ path: `report/screenshots/${scenario.pickle.name}.png`, fullPage: true })
    this.attach(buffer, 'image/png');
  }
});