import React from 'react';
import { Piece } from './Piece';

export const Puzzle = ({ store }) => {
  const { imageData, pieceSize, image } = store.state;

  return (
    <div id="puzzle-container">
      {Object.values(imageData).map(({ piece, dataURL, location }) => (
        <Piece key={piece.id} {...piece} {...location} dataURL={dataURL} />
      ))}
    </div>
  );
};
