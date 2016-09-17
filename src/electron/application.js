import { app, ipcMain, globalShortcut } from 'electron';

import MainWindow from './components/windows/main';
import TrayIcon from './components/tray-icon';
import ClipboardManager from './components/clipboard-manager';
import HistoryList from './components/history-list';

const GLOBAL_SHORTCUT = 'ctrl+alt+v';

//require('electron-reload')(rootFolder);
//electron.crashReporter.start();

class Application {
  constructor(settings) {
    this.app = app;
    this.settings = settings;

    this.canQuit = false;

    this.trayIcon = null;
    this.mainWindow = null;
    this.clipboardManager = null;
    this.historyList = null;

    app.on('ready', this.handleAppReady);
    app.on('window-all-closed', this.handleAppAllWindowClosed);
    app.on('will-quit', this.handleAppWillQuit);
  }

  handleAppAllWindowClosed = () => {
    if ('darwin' !== process.platform) {
      this.app.quit();
    }
  };

  handleAppWillQuit = () => {
    this.unRegisterShortCut();

    if (this.historyList) {
      this.historyList.destroy();
    }

    if (this.clipboardManager) {
      this.clipboardManager.destroy();
    }

    if (this.trayIcon) {
      this.trayIcon.destroy();
    }
  };

  handleAppReady = () => {
    this.mainWindow = new MainWindow();

    this.mainWindow.on('close', event => {
      if (!this.canQuit) {
        event.preventDefault();
      }

      this.mainWindow.hide();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.registerShortCut();

    this.mainWindow.getWebContents().on('dom-ready', () => {
      if (this.historyList) {
        return this.mainWindow.setClipboardList(
          this.historyList.getList()
        );
      }

      this.clipboardManager = new ClipboardManager();
      this.historyList = new HistoryList(this.clipboardManager);

      this.historyList.on(HistoryList.EVENT_UPDATED, (list) => {
        this.mainWindow.setClipboardList(list);
      });
    });

    this.trayIcon = new TrayIcon(app.getName(), app.getVersion());

    this.trayIcon.onQuitClick(() => {
      this.canQuit = true;
      this.app.quit();
    });

    this.trayIcon.on('click', () => {
      this.mainWindow.show();
    });
  };

  registerShortCut() {
    const result = globalShortcut.register(GLOBAL_SHORTCUT, () => {
      this.mainWindow.show();
    });

    if (!result) {
      console.log('registration failed');
    }
  }

  unRegisterShortCut() {
    globalShortcut.unregister(GLOBAL_SHORTCUT);
  }
}

export default Application;
