import React from 'react';
import { Shape } from './Shape';

export const Puzzle = ({ store }) => {
  const { shapes, pieceSize, image } = store.state;

  return (
    <div
      id="puzzle-container"
      style={{ width: `${image.width * 2}px`, height: `${image.height * 2}px` }}
    >
      {Object.values(shapes).map(({ id, pieces, dataURL, location }) => (
        <Shape
          key={id}
          {...location}
          dataURL={dataURL}
          pieces={pieces}
          {...pieceSize}
        />
      ))}
    </div>
  );
};
