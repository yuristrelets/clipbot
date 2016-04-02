import { clipboard } from 'electron';
import EventEmitter from 'events';

const TIMEOUT = 100;
const CLIPBOARD_FORMAT = 'text/plain';

class ClipboardManager extends EventEmitter {
  constructor() {
    super();

    this.timer = setInterval(this.tick.bind(this), TIMEOUT);
    this.lastText = null;
  }

  tick() {
    const text = clipboard.readText(CLIPBOARD_FORMAT);

    if (text && text !== this.lastText) {
      this.lastText = text;

      this.emit('changed', text);
    }
  }

  destroy() {
    clearInterval(this.timer);

    this.timer = null;
    this.lastText = null;
  }
}

export default ClipboardManager;
