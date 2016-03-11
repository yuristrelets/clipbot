const electron = require('electron');

const app = electron.app;
const ipcMain = electron.ipcMain;
const clipboard = electron.clipboard;

const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const Menu = electron.Menu;
const Tray = electron.Tray;

const GLOBAL_SHORTCUT = 'ctrl+alt+v';

var clipboardList = [];
var clipboardLastText = '';

var appIcon = null;
var canQuit = false;

require('electron-reload')(__dirname);
electron.crashReporter.start();

var mainWindow = null;
var clipboardLoop = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    skipTaskbar: true,
    show: false
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setMenu(null);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('blur', function() {
    mainWindow.hide();
    mainWindow.center();
  });

  // Emitted when the window is closed.
  mainWindow.on('close', function(event) {
    if (!canQuit) {
      event.preventDefault();
    }

    mainWindow.hide();
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var ret = globalShortcut.register(GLOBAL_SHORTCUT, function() {
    mainWindow.show();
  });

  if (!ret) {
    console.log('registration failed');
  }

  mainWindow.webContents.on('dom-ready', function() {
    clipboardLoop = setInterval(function() {
      var text = clipboard.readText('text/plain');

      if (text && text !== clipboardLastText) {
        clipboardLastText = text;
        //mainWindow.webContents.send('clipboardFormats', clipboard.availableFormats());
        clipboardList.unshift({
          original: text,
          preview: text.split('\n')[0]
        });

        mainWindow.webContents.send('clipboard.list.updated', clipboardList);
      }
    }, 100);
  });

  appIcon = new Tray('./app.ico');
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'About Klipper...',
      type: 'normal'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      type: 'normal',
      click: function() {
        canQuit = true;
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip('My application');
  appIcon.setContextMenu(contextMenu);

  appIcon.on('click', function() {
    // appIcon.popUpContextMenu();
    // appIcon.displayBalloon({
    //   title: 'Klipper',
    //   content: 'Klipper content!'
    // });
    mainWindow.show();
  });
});

app.on('will-quit', function() {
  globalShortcut.unregister(GLOBAL_SHORTCUT);

  clearInterval(clipboardLoop);
  // Unregister all shortcuts.
  // globalShortcut.unregisterAll();

  if (appIcon) {
    appIcon.destroy();
  }
});
