/* Global setup for Detox E2E tests */
const detox = require('detox');
const config = require('../package.json').detox;

beforeAll(async () => {
  await detox.init(config, { launchApp: false });
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' }
  });
});

afterAll(async () => {
  await detox.cleanup();
});

beforeEach(async () => {
  await device.reloadReactNative();
});
