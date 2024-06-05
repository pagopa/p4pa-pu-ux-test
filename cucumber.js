const common = `
  --require config/config.js 
  --require setup/hooks.js 
  --require feature/step/**/*.steps.js
  `;

module.exports = {
  default: `${common} features/**/*.feature`
};