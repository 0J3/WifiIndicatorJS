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
		maxHeight: height+64,
		maxWidth: width+64,
		minHeight: height,
		minWidth: width,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// ;

	mainWindow.loadFile('app.html');

	// mainWindow.loadFile(path.join(__dirname, '../index.html'));

	mainWindow.setAlwaysOnTop(true);
	mainWindow.setSkipTaskbar(true);
	mainWindow.setOpacity(0.7);
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
