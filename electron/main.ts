import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { initDatabase } from './database/connection'
import { registerProjectHandlers } from './ipc/project'
import { registerLibraryHandlers } from './ipc/library'
import { registerBillHandlers } from './ipc/bill'
import { registerSummaryHandlers } from './ipc/summary'
import { registerUnitPriceHandlers } from './ipc/unitprice'
import { registerExportHandlers } from './ipc/export'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: '工程造价清单计价系统',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  try {
    initDatabase()
    console.log('[DB] SQLite initialized OK')
  } catch (err) {
    console.error('[DB] init FAILED:', err)
  }
  registerProjectHandlers()
  registerLibraryHandlers()
  registerBillHandlers()
  registerSummaryHandlers()
  registerUnitPriceHandlers()
  registerExportHandlers()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
