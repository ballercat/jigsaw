// A piece is a DOM element rendering a rectangular area
// of the image
//
// TODO: edge decorators
import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

export const Piece = ({ dataURL, size }) => {
  // Using a span with a background-url instead of an image with a src gets
  // around some annoying browser specific draggable image behavior
  return (
    <div
      style={{
        background: `url(${dataURL})`,
        width: `${size[0]}px`,
        height: `${size[1]}px`,
      }}
    />
  );
};

Piece.propTypes = {
  size: PropTypes.arrayOf(PropTypes.number).isRequired,
};
