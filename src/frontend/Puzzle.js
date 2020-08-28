import React, { useMemo, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Piece } from './Piece';

function usePuzzle(puzzle) {
  const [pieces, setPieces] = useState(puzzle.pieces);

  const handleMove = (item, { x, y }) => {
    setPieces(pieces.map(piece => {}));
  };

  return {
    pieces,
    handleMove,
  };
}

export const Puzzle = ({ store }) => {
  const { imageData, pieceSize } = store.state;
  const image = useRef(null);
  const canvasEl = useRef(null);
  const containerEl = useRef(null);
  const [_, drop] = useDrop({
    accept: 'piece',
    canDrop() {
      return true;
    },
    drop: (item, monitor) => {
      console.log(item, monitor.getClientOffset());
      store.dispatch({
        type: 'move',
        payload: { item, offset: monitor.getClientOffset() },
      });
    },
  });

  return (
    <div ref={drop} id="puzzle-container">
      {imageData ? (
        Object.values(imageData).map(({ piece, dataURL, location }) => (
          <Piece key={piece.id} {...piece} {...location} dataURL={dataURL} />
        ))
      ) : (
        <canvas ref={canvasEl} id="canvas"></canvas>
      )}
    </div>
  );
};
