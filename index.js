const electron = require('electron')
const path = require('path')
const url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const devMode = process.env.dev_mode

let mainWindow

function createWindow () {
	mainWindow = new BrowserWindow({
		webPreferences: {
			//nodeIntegration: false,
			webSecurity: false
		},
		width: 460,
		height: 600
	})
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'pages/index.html'),
			protocol: 'file:',
			slashes: true
		})
	)

	if (devMode) {
		mainWindow.webContents.openDevTools()
	}

	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})
