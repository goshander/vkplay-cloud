const {
  app, globalShortcut, BrowserWindow,
} = require('electron')
const path = require('path')
const { switchFullscreenState } = require('./windowManager')

const homePage = 'https://cloud.vkplay.ru'
// const checkApi = 'https://*.cloud.vkplay.ru/*'

const userAgent
= 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.3' // Windows

app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,WaylandWindowDecorations,RawDraw')

app.commandLine.appendSwitch(
  'disable-features',
  'UseChromeOSDirectVideoDecoder',
)
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode')
app.commandLine.appendSwitch('enable-accelerated-video')
app.commandLine.appendSwitch('ignore-gpu-blocklist')
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers')
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')
app.commandLine.appendSwitch('enable-gpu-memory-buffer-video-frames')
app.commandLine.appendSwitch('use-gl', 'egl')

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

  // const escTimeout = null
  // const escDownTimeout = null

  globalShortcut.register('Esc', async () => {
    const window = BrowserWindow.getAllWindows()[0]

    window.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 'Esc',
    })
    window.webContents.sendInputEvent({
      type: 'keyUp',
      keyCode: 'Esc',
    })

    // if (escTimeout) clearTimeout(escTimeout)
    // if (!escDownTimeout) {
    //   escDownTimeout = setTimeout(() => {
    //     clearTimeout(escDownTimeout)
    //     window.webContents.sendInputEvent({
    //       type: 'keyDown',
    //       keyCode: 'Esc',
    //     })
    //     window.webContents.sendInputEvent({
    //       type: 'keyUp',
    //       keyCode: 'Esc',
    //     })
    //   }, 2000)
    // }
    // escTimeout = setTimeout(() => {
    //   if (escDownTimeout) {
    //     clearTimeout(escDownTimeout)
    //     escDownTimeout = null
    //   }
    // }, 100)

    // window.webContents.sendInputEvent({
    //   type: 'char',
    //   keyCode: 'Esc',
    // })
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
