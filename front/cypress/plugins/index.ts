/// <reference types="cypress" />
import * as registerCodeCoverageTasks from '@cypress/code-coverage/task';



const pluginConfig: Cypress.PluginConfig = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  registerCodeCoverageTasks(on, config);
  return config;
};

export default pluginConfig;
