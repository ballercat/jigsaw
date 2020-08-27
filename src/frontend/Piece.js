// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators

import React from 'react';

export const Piece = ({
  // dimensions
  location, // required,
  dataURL,
  top,
  left,
}) => {
  return (
    <div
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
