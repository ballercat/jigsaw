import { html, render } from 'lit-html';
import makeStore from './store';
import Main from './frontend/main';

const div = document.createElement('div');
div.id = 'main';
document.body.appendChild(div);

makeStore(store => render(Main(store), div)).dispatch({ type: 'init' });
