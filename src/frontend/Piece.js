// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators

import React from 'react';

export const Piece = ({
  // dimensions
  dimensions, // required, don't render 0x0
  location, // required,
  dataURL,
}) => {
  const { width, height } = dimensions;
  const [x, y] = location;
  return (
    <div
      style={{
        display: 'inline',
        position: 'absolute',
        left: width * Math.max(x, 0),
        top: height * Math.max(y, 0),
        border: '2px black',
      }}
    >
      <img src={dataURL} />
    </div>
  );
};
