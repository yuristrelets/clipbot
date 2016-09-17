/*import { ipcRenderer } from 'electron';
import styles from './app.less';

const $list = document.getElementById('list');

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

 ipcRenderer.on('clipboardFormats', function(event, formats) {
   console.log('-->', formats);
 });*/

import React from 'react';
import { render } from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';

import './app.less';

const rootReducer = combineReducers({
  data: (state = null) => {
    return state;
  }
});

const store = createStore(rootReducer);

class App extends React.Component {
  render() {
    return (
      <span>application</span>
    );
  }
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);