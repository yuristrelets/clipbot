const ipcRenderer = require('electron').ipcRenderer;

const $list = document.querySelector('#list');

ipcRenderer.on('clipboard.list.updated', function(event, list) {
  console.log(list);

  renderList(list, $list);
});

function renderList(list, element) {
  var html = list.map(function(item, index) {
    return '<div>' + item.preview + '</div>';
  });

  element.innerHTML = html.join('');
}

// ipcRenderer.on('clipboardFormats', function(event, formats) {
//   console.log('-->', formats);
// });
