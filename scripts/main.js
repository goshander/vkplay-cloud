const {
  app, globalShortcut, BrowserWindow,
} = require('electron')
const path = require('path')
const { switchFullscreenState } = require('./windowManager')

const homePage = 'https://cloud.vkplay.ru'
// const checkApi = 'https://*.cloud.vkplay.ru/*'

const userAgent
= 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' // Windows
// app.commandLine.appendSwitch('disable-features', 'UserAgentClientHint')

app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder')
app.commandLine.appendSwitch(
  'disable-features',
  'UseChromeOSDirectVideoDecoder',
)
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode')
app.commandLine.appendSwitch('enable-accelerated-video')
app.commandLine.appendSwitch('ignore-gpu-blacklist')
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers')
app.commandLine.appendSwitch('enable-gpu-rasterization')

async function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      userAgent,
    },
  })

  mainWindow.loadURL(homePage)
}

app.whenReady().then(async () => {
  createWindow()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  globalShortcut.register('Super+F', async () => {
    switchFullscreenState()
  })

  globalShortcut.register('F11', async () => {
    switchFullscreenState()
  })

  globalShortcut.register('Alt+F4', async () => {
    app.quit()
  })

  globalShortcut.register('Alt+Home', async () => {
    BrowserWindow.getAllWindows()[0].loadURL(homePage)
  })

  globalShortcut.register('F4', async () => {
    app.quit()
  })

  globalShortcut.register('Control+Shift+I', () => {
    BrowserWindow.getAllWindows()[0].webContents.toggleDevTools()
  })

  globalShortcut.register('Esc', async () => {
    const window = BrowserWindow.getAllWindows()[0]

    window.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 'Esc',
    })
    window.webContents.sendInputEvent({
      type: 'char',
      keyCode: 'Esc',
    })
    window.webContents.sendInputEvent({
      type: 'keyUp',
      keyCode: 'Esc',
    })

    window.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 'Esc',
    })
    window.webContents.sendInputEvent({
      type: 'char',
      keyCode: 'Esc',
    })
    window.webContents.sendInputEvent({
      type: 'keyUp',
      keyCode: 'Esc',
    })
  })
})

app.on('browser-window-created', async (e, window) => {
  window.setBackgroundColor('#1A1D1F')
  window.setMenu(null)

  window.webContents.setUserAgent(userAgent)

  window.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    BrowserWindow.getAllWindows()[0].loadURL(url)
  })
})

app.on('will-quit', async () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
