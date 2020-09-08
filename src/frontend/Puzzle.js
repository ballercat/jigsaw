import React from 'react';
import PropTypes from 'prop-types';
import { Shape } from './Shape';
import { pick } from '../utils';

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
      {Object.values(shapes).map(shape => (
        <Shape
          key={shape.id}
          {...shape}
          pieces={shape.pieces.map(k => store.state.pieces[k])}
          size={size}
          onDrop={handleDrop}
          state={store.state}
        />
      ))}
    </div>
  );
};

Puzzle.propTypes = {
  store: PropTypes.object.isRequired,
};
