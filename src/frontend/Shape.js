import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { Piece } from './Piece';

export const Shape = ({ id, pieces, loc, onDrop, state }) => {
  const [drag, setDrag] = useState(false);

  if (!pieces.length) {
    return null;
  }

  // zero-th piece is always the origin of the shape (top left corner)
  const origin = pieces[0].location;

  return (
    <>
      <Draggable
        defaultPosition={{ x: loc[0], y: loc[1] }}
        onStop={(_, { x, y }) => {
          onDrop(id, { x, y });
          setDrag(false);
        }}
        onStart={() => {
          setDrag(true);
        }}
      >
        <div
          style={{
            position: 'absolute',
            userSelect: 'none',

            top: 0,
            left: 0,
            zIndex: drag ? '1' : 'none',
            border: '5px dashed green',
          }}
        >
          {pieces.map(piece => (
            <Piece key={piece.id} {...piece} origin={origin} state={state} />
          ))}
        </div>
      </Draggable>
    </>
  );
};

Shape.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.arrayOf(PropTypes.number).isRequired,
  pieces: PropTypes.array.isRequired,
  loc: PropTypes.arrayOf(PropTypes.number).isRequired,
  onDrop: PropTypes.func.isRequired,
};
