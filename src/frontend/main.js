import { html } from 'lit-html';
import ImageInput from './image-input';
import imageActions from './image-actions';
import './main.css';

const Main = store => html`
  <div class="Container">
    ${ImageInput({
      ...store.state.imageBlock,
      ...imageActions(store),
    })}
    ${(/* modal implementation here */) => ''}
  </div>
`;

export default Main;
