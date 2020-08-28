// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators

import React from 'react';
import Draggable from 'react-draggable';

export const Piece = ({
  // dimensions
  id,
  location, // required,
  dataURL,
  top,
  left,
}) => {
  return (
    <Draggable defaultPosition={{ y: top, x: left }}>
      <img src={dataURL} />
    </Draggable>
  );
};

Piece.propTypes = {};
