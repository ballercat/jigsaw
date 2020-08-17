import React from 'react';
import { render } from 'react-dom';
import { Main } from './frontend/Main';

const div = document.createElement('div');
div.id = 'main';
document.body.appendChild(div);

render(<Main />, document.getElementById('main'));
