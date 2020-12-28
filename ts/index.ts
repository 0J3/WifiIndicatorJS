const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const createWindow = () => {
	// Create the browser window.
	let width = 175;
	let height = 60;
	const mainWindow = new BrowserWindow({
		width: width,
		height: height,
		maxHeight: height,
		maxWidth: width,
		minHeight: height,
		minWidth: width,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// ;

	mainWindow.loadFile('index.html');

	// mainWindow.loadFile(path.join(__dirname, '../index.html'));

	mainWindow.setAlwaysOnTop(true);
	mainWindow.setOpacity(0.5);
};

app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
