/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */

module.exports = {
  mutator: 'javascript',
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  coverageAnalysis: 'off',
  dashboard: {
    project: 'github.com/claytonsilva/nodejs-hexagonal-boilerplate'
  },
  mutate: [
    'src/**/*.js',
    '!src/ports/http/**/*.js',
    '!src/ports/aws-lambda/**/*.js',
    '!src/ports/logger/**/*.js',
    '!src/**/*.spec.js'
  ],
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true
  }
}
