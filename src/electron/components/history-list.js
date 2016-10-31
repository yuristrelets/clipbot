import EventEmitter from 'events';

class HistoryListItem {
  constructor(text) {
    this.id = Date.now();
    this.text = text;
    this.preview = text.split('\n')[0];
  }
}

class HistoryList extends EventEmitter {
  static EVENT_UPDATED = 'updated';

  constructor(clipboardManager, maxItems = 50) {
    super();

    this.cm = clipboardManager;

    this.list = [];
    this.setMaxItems(maxItems);

    this.addListeners();
  }

  addListeners() {
    this.cm.on(this.cm.EVENT_CHANGED, text => {
      this.list.unshift(new HistoryListItem(text));
      this.list = this.list.slice(0, this.maxItems);

      this.emit(HistoryList.EVENT_UPDATED, this.list);
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
