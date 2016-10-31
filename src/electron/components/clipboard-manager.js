import { clipboard } from 'electron';
import EventEmitter from 'events';

const TIMEOUT = 100;
const CLIPBOARD_FORMAT = 'text/plain';

class ClipboardManager extends EventEmitter {
  static EVENT_CHANGED = 'changed';

  constructor() {
    super();

    this.timer = setInterval(this.handleIntervalTick, TIMEOUT);
    this.lastText = null;
  }

  handleIntervalTick = () => {
    const text = clipboard.readText(CLIPBOARD_FORMAT);

    if (text && text !== this.lastText) {
      this.lastText = text;

      this.emit(ClipboardManager.EVENT_CHANGED, text);
    }
  };

  destroy() {
    clearInterval(this.timer);

    this.timer = null;
    this.lastText = null;
  }
}

export default ClipboardManager;
