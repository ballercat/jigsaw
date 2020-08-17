import React from 'react';

export const Puzzle = ({ store }) => {
  const { imageBlock, source, puzzle } = store.state;

  if (!puzzle) {
    return imageBlock.source
      ?
          <img src={imageBlock.source} />
      : null;
  }

  return <div id="puzzle-container">
      <div></div>
    </div>
};
