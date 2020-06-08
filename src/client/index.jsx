import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app';

import 'styles/carbon.scss';


function render() {
  ReactDOM.render(<App />, document.querySelector('#root'));
}

render();
