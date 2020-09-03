import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { Piece } from './Piece';

export const Shape = ({ id, pieces, loc, onDrop }) => {
  const [drag, setDrag] = useState(false);

  if (!pieces.length) {
    return null;
  }

  // zero-th piece is always the origin of the shape (top left corner)
  const origin = pieces[0].location;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: `${loc[0]}px`,
          left: `${loc[1]}px`,
          width: '5px',
          height: '5px',
          backgroundColor: 'red',
          zIndex: '100',
        }}
      />
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
            border: drag ? '2px dashed green' : 'none',
          }}
        >
          {pieces.map(piece => (
            <Piece key={piece.id} {...piece} origin={origin} />
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
