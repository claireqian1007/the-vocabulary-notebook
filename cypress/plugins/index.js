const path = require('path')
const pkg = require('../../package')

const pathToElectron = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'electron'
)

module.exports = (on, config) => {
  config.browsers = [
    {
      name: 'notebook',
      family: 'electron',
      displayName: 'Electron App',
      version: pkg.version,
      path: pathToElectron,
      majorVersion: `v${pkg.version}`,
      info:
        pkg.description || 'The vocabulary notebook powered by Electron.js'
    }
  ]

  return config
}
