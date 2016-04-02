import EventEmitter from 'events';

class HistoryListItem {
  constructor(text) {
    this.originalText = text;
    this.previewText = text.split('\n')[0];
  }
}

class HistoryList extends EventEmitter {
  constructor(clipboardManager, maxItems = 50) {
    super();

    this.cm = clipboardManager;

    this.list = [];
    this.setMaxItems(maxItems);

    this.addListeners();
  }

  addListeners() {
    this.cm.on('changed', (text) => {
      this.list.unshift(new HistoryListItem(text));
      this.list = this.list.slice(0, this.maxItems);

      this.emit('updated', this.list);
    });
  }

  setMaxItems(maxItems) {
    this.maxItems = maxItems;
  }

  getList() {
    return this.list;
  }

  destroy() {
    this.cm = null;
    this.list.length = 0;
  }
}

export default HistoryList;
