import { html } from 'lit-html';

export const Basic = () => {
  return html`
    <svg width="0" height="0">
      <defs>
        <clipPath id="clip-basic">
          <rect x="0" y="0" width="100" height="100" />
        </clipPath>
      </defs>
    </svg>
  `;
};
