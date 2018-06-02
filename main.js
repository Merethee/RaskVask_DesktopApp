// Require Electron and Node.js modules
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Notification = electron.Notification;
var ipcMain = electron.ipcMain; 
var Tray = electron.Tray; 

var path = require('path');
var url = require('url');

// Global reference of the window object
var win, popup;

function createWindow() {

    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 670,
        resizable: false,
        titleBarStyle: "hidden"
    
    })

    // Load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'www/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Add Tary Icon + timer 
    var tray = new Tray('/app_icons/Icon.png'); 
    ipcMain.on('countdown', function(event, arg){
        tray.setTitle(arg);
    });

    // Notification  message when timer is done
    ipcMain.on('counterDone', function(event, arg){
        popup = new Notification ({
            title: arg,
            body: "Nå kan du begynne på neste gjøremål",
        });
        popup.show();
        
    });

    // Emitted when the window is closed.
    win.on('closed', function () {
        win = null
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});



