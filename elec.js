const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 719,
    height: 719,
  })

  win.loadFile('src/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
