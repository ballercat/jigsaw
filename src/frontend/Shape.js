import React from 'react';
import Draggable from 'react-draggable';
import { Piece } from './Piece';

export const Shape = ({ id, pieces, dataURL, top, left }) => {
  return (
    <Draggable defaultPosition={{ x: 50, y: 50 }}>
      <div style={{ position: 'absolute' }}>
        {pieces.map(piece => (
          <Piece key={piece.id} dataURL={dataURL} />
        ))}
      </div>
    </Draggable>
  );
};
