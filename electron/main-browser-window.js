const defaultsDeep = require('lodash/defaultsDeep')
const { BrowserWindow } = require('electron')

module.exports = (options = {}) => {
  defaultsDeep(options, {
    width: 640,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  let win = new BrowserWindow(options)
  win.on('closed', () => {
    win = null
  })
  return win
}
