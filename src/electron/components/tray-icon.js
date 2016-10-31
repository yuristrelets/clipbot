import { Tray, Menu, nativeImage } from 'electron';
import appIcon from '../resources/app.png';

class TrayIcon {
  constructor(appName, appVersion) {
    this.appName = appName;
    this.appVersion = appVersion;

    this.icon = this.createIcon();
  }

  createIcon() {
    const icon = new Tray(nativeImage.createFromDataURL(appIcon));

    icon.setToolTip(this.appName);
    icon.setContextMenu(this.createMenu());

    return icon;
  }

  createMenu() {
    const template = [
      {
        label: `${this.appName} ${this.appVersion}`,
        type: 'normal',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          this.onQuitClickCallback();
        }
      }
    ];

    return Menu.buildFromTemplate(template);
  }

  getIcon() {
    return this.icon;
  }

  on(name, callback) {
    this.getIcon().on(name, callback);
  }

  onQuitClick(callback) {
    this.onQuitClickCallback = callback;
  }

  destroy() {
    this.getIcon().destroy();
  }
}

export default TrayIcon;
