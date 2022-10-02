const { app, BrowserWindow } = require('electron')

let isFullScreen = false
let isGameStreamingScreen = false

function toggleFullscreen(state) {
  const window = BrowserWindow.getAllWindows()[0]
  const actualState = window.isFullScreen()
  if (isFullScreen !== state || actualState !== state) {
    if (state || !isGameStreamingScreen) {
      window.setFullScreen(state)
      isFullScreen = state
      // eslint-disable-next-line no-console
      console.log(`fullscreen state changed to: ${state}`)

      if (state) {
        // eslint-disable-next-line no-use-before-define
        focusWindow()
      }
    }
  }
}

function toggleGameStreamingMode(state) {
  if (isGameStreamingScreen !== state) {
    isGameStreamingScreen = state
    // eslint-disable-next-line no-console
    console.log(`game streaming mode state changed to: ${state}`)
  }

  toggleFullscreen(isGameStreamingScreen)

  if (state) {
    // eslint-disable-next-line no-use-before-define
    focusWindow()
  }
}

function switchFullscreenState() {
  if (isFullScreen) {
    toggleFullscreen(false)
  } else {
    toggleFullscreen(true)
  }
}

function focusWindow() {
  BrowserWindow.getAllWindows()[0].focus()
}

app.on('browser-window-created', async (_, window) => {
  window.on('leave-full-screen', async (event) => {
    event.preventDefault()
    if (isGameStreamingScreen) {
      toggleFullscreen(true)
    }
  })
  window.on('page-title-updated', async (event, title) => {
    // ? FIX implement stream mode
    toggleGameStreamingMode(title.includes('---'))
  })
})

module.exports = { toggleFullscreen, switchFullscreenState }
