import React from 'react';
import { Shape } from './Shape';

export const Puzzle = ({ store }) => {
  const { shapes, size, image } = store.state;

  const handleDrop = (id, offset) => {
    store.dispatch({ type: 'move', payload: { id, offset } });
  };

  return (
    <div
      id="puzzle-container"
      style={{ width: `${image.width * 2}px`, height: `${image.height * 2}px` }}
    >
      {Object.values(shapes).map(({ id, pieces, dataURL, loc }) => (
        <Shape
          key={id}
          id={id}
          loc={loc}
          dataURL={dataURL}
          pieces={pieces}
          size={size}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};
