// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators

import React from 'react';
import { useDrag } from 'react-dnd';

export const Piece = ({
  // dimensions
  id,
  location, // required,
  dataURL,
  top,
  left,
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id, type: 'piece' },
    collect: monitor => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });
  if (isDragging) {
    return null;
  }

  return (
    <div
      ref={drag}
      style={{
        zIndex: '-1',
        display: 'inline',
        position: 'absolute',
        border: '2px black',
        left,
        top,
      }}
    >
      <img src={dataURL} />
    </div>
  );
};

Piece.propTypes = {};
