import React, { useMemo, useRef, useEffect } from 'react';
import { Piece } from './Piece';

export const Puzzle = ({ store }) => {
  const { source, puzzle } = store.state;
  const image = useRef(null);
  const canvasEl = useRef(null);

  useEffect(() => {
    if (!(source && canvasEl.current)) {
      return;
    }

    const img = new Image();
    img.src = source;
    img.onload = () => {
      image.current = img;
      const ctx = canvasEl.current.getContext('2d');
      canvasEl.current.width = img.width;
      canvasEl.current.height = img.height;
      console.log(img.width, img.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [source, canvasEl]);

  const pieces = useMemo(() => {
    if (!puzzle) {
      return null;
    }

    const width = canvasEl.current.width / puzzle.width;
    const height = canvasEl.current.height / puzzle.height;
    const dimensions = { width, height };

    const sourceCtx = canvasEl.current.getContext('2d');

    const dest = document.createElement('canvas');
    dest.width = dimensions.width;
    dest.height = dimensions.height;
    const destCtx = dest.getContext('2d');

    return puzzle.pieces.map(piece => {
      const [x, y] = piece.location;
      // get imagedata from source, paint it to destination export to image
      const imageData = sourceCtx.getImageData(
        width * x,
        height * y,
        width,
        height
      );
      destCtx.clearRect(0, 0, canvas.width, canvas.height);
      destCtx.putImageData(imageData, 0, 0);

      const dataURL = dest.toDataURL();

      return { piece, dimensions, dataURL };
    });
  }, [puzzle]);

  console.log(pieces);
  return (
    <div id="puzzle-container">
      {pieces ? (
        pieces.map(({ piece, dimensions, dataURL }) => (
          <Piece
            key={piece.id}
            {...piece}
            dimensions={dimensions}
            dataURL={dataURL}
          />
        ))
      ) : (
        <canvas ref={canvasEl} id="canvas"></canvas>
      )}
    </div>
  );
};
