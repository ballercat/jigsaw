import {html, render} from 'lit-html';

const div = document.createElement('div');
div.id = 'main';
document.body.appendChild(div);

const Test = () => html`<h1>Hello World!</h1>`;
render(Test(), div);

