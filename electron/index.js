const { app } = require('electron')
const path = require('path')
const createMainBrowserWindow = require('./main-browser-window')

let mainWindow = null

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log)
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')()
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development'
  ) {
    await installExtensions()
  }

  mainWindow = createMainBrowserWindow({
    show: false
  })

  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  } else {
    mainWindow.loadURL('http://127.0.0.1:3000')
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

app.on('ready', createWindow)

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
