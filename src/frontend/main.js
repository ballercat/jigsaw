import { html } from 'lit-html';
import ImageInput from './image-input';
import imageActions from './image-actions';
import { Basic } from './clip';
import './main.css';

const Main = store => html`
  <div class="Container">
    ${Basic()}
    ${ImageInput({
      ...store.state.imageBlock,
      ...imageActions(store),
    })}
  </div>
`;

export default Main;
