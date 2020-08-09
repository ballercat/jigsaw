import { html } from 'lit-html';

export default function ImageInput({
  savedImage,
  source,
  onLoad,
  onPaste,
  onSave,
}) {
  return html`
  <div>
    <button @click=${onSave} ?disabled=${source == null}>Save</button>
    <button @click=${() =>
      onLoad(savedImage)} ?disabled=${!savedImage}>Load</button>
  </div>
  <div>
  <input type="file"></input>
  ${
    source
      ? html`
          <img src="${source}" />
        `
      : html`
          <textarea rows="10" @paste=${onPaste}>
${source || 'Paste Image'}</textarea
          >
        `
  }
  </div>
`;
}
