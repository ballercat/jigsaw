// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators

import React from 'react';
import Draggable from 'react-draggable';

export const Piece = ({
  dataURL,
}) => {
  return (
      <img src={dataURL} />
  );
};

Piece.propTypes = {};
