/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */

module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  testRunner: 'jest',
  coverageAnalysis: 'off',
  dashboard: {
    project: 'github.com/claytonsilva/nodejs-hexagonal-boilerplate'
  },
  ignorePatterns: ["reports", "node_modules"],
  mutate: [
    'src/**/*.js',
    '!src/ports/http/**/*.js',
    '!src/ports/aws-lambda/**/*.js',
    '!src/ports/logger/**/*.js',
    '!src/**/*.spec.js',
  ],
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true
  },
  timeoutMS: 15000
}
