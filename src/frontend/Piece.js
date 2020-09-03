// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators
import React from 'react';
import PropTypes from 'prop-types';
import { subtract, multiply } from '../vector';

export const Piece = ({ dataURL, size, origin, location }) => {
  // Using a span with a background-url instead of an image with a src gets
  // around some annoying browser specific draggable image behavior
  const loc = multiply(subtract(location, origin), size);
  if (origin !== location) {
    console.log(loc);
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: `${loc[1]}px`,
        left: `${loc[0]}px`,
        background: `url(${dataURL})`,
        width: `${size[0]}px`,
        height: `${size[1]}px`,
      }}
    />
  );
};

Piece.propTypes = {
  size: PropTypes.arrayOf(PropTypes.number).isRequired,
  origin: PropTypes.arrayOf(PropTypes.number).isRequired,
  location: PropTypes.arrayOf(PropTypes.number).isRequired,
  dataURL: PropTypes.string.isRequired,
};
