import { BrowserWindow } from 'electron';

const windowUrl = 'file://' + process.cwd() + '/dist/browser/app/index.html';

const windowParams = {
  width: 850,
  height: 600,
  resizable: false,
  skipTaskbar: true,
  show: false
};

const EVENT_CLIPBOARD_UPDATED = 'clipboard.list.updated';

class MainWindow {
  constructor() {
    this.window = this.createWindow();
  }

  createWindow() {
    const window = new BrowserWindow(windowParams);

    window.loadURL(windowUrl);
    window.setMenuBarVisibility(false);
    window.setMenu(null);

    window.webContents.openDevTools();

    window.on('blur', () => {
      window.hide();
      window.center();
    });

    return window;
  }

  getWindow() {
    return this.window;
  }

  on(name, callback) {
    this.getWindow().on(name, callback);
  }

  openDevTools() {
    this.getWebContents().openDevTools();
  }

  getWebContents() {
    return this.getWindow().webContents;
  }

  show() {
    this.getWindow().show();
  }

  hide() {
    this.getWindow().hide();
  }

  center() {
    this.getWindow().center();
  }

  setClipboardList(list) {
    this.getWebContents().send(EVENT_CLIPBOARD_UPDATED, list);
  }
}

export default MainWindow;
