import React, { useReducer, useState } from 'react';
import jigsaw from '../jigsaw';
import { Puzzle } from './Puzzle';
import { Preview } from './Preview';
import { Toolbar } from './Toolbar';
import './main.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { add, multiply, subtract } from '../vector';
import { pick } from '../utils';

const useStyles = makeStyles(() => ({
  fab: {
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed',
  },
}));

const check = (a, b) => {
  return Math.abs(a - b) < 5;
};
const distance = (v1, v2) => {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'load-image':
      return {
        ...state,
        ...action.payload,
      };
    case 'generate':
      return {
        ...state,
        ...action.payload,
        groups: [],
      };
    case 'move': {
      const { id, offset } = action.payload;
      const { shapes, size } = state;
      // find if the item is next to one of it's neighbors
      const newLocation = [...Object.values(offset)];
      let updatedPieces = {};
      const updatePieceLocations = (delta, pieces) =>
        pieces.forEach(id => {
          updatedPieces[id] = {
            ...state.pieces[id],
            loc: add(state.pieces[id].loc, delta),
          };
        });
      updatePieceLocations(
        subtract(newLocation, shapes[id].loc),
        shapes[id].pieces
      );

      let updatedShapes = {
        [id]: {
          ...state.shapes[id],
          loc: newLocation,
        },
      };
      let move = [];

      Object.values(updatedPieces).forEach(piece => {
        piece.unsolved = piece.unsolved.filter(([edge, { id }]) => {
          const test = state.pieces[id];
          let solved = false;
          if (edge === 'top') {
            solved =
              distance(add(piece.loc, piece.v[0]), add(test.loc, test.v[2])) <
                5 &&
              distance(add(piece.loc, piece.v[1]), add(test.loc, test.v[3])) <
                5;
          } else if (edge === 'bottom') {
            solved =
              distance(add(piece.loc, piece.v[2]), add(test.loc, test.v[0])) <
                5 &&
              distance(add(piece.loc, piece.v[3]), add(test.loc, test.v[1])) <
                5;
          } else if (edge === 'left') {
            solved =
              distance(add(piece.loc, piece.v[0]), add(test.loc, test.v[1])) <
                5 &&
              distance(add(piece.loc, piece.v[2]), add(test.loc, test.v[3])) <
                5;
          } else if (edge === 'right') {
            solved =
              distance(add(piece.loc, piece.v[1]), add(test.loc, test.v[0])) <
                5 &&
              distance(add(piece.loc, piece.v[3]), add(test.loc, test.v[2])) <
                5;
          }

          if (solved) {
            move = [...move, ...state.shapes[test.shapeId].pieces];
          }

          return !solved;
        });
      });

      move
        .map(pieceId => state.pieces[pieceId])
        .forEach(piece => {
          const oldShapeId = piece.shapeId;

          updatedPieces[piece.id] = {
            ...piece,
            shapeId: id,
          };
          updatedShapes = {
            ...updatedShapes,
            [id]: {
              ...state.shapes[id],
              pieces: [...state.shapes[id].pieces, piece.id],
            },
            [oldShapeId]: {
              ...state.shapes[oldShapeId],
              pieces: state.shapes[oldShapeId].pieces.filter(
                pid => pid !== piece.id
              ),
            },
          };
        });

      return {
        ...state,
        shapes: {
          ...state.shapes,
          ...updatedShapes,
        },
        pieces: {
          ...state.pieces,
          ...updatedPieces,
        },
      };
    }
    default:
      return state;
  }
};

function loadImage(source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      reject(new Error('Cannot load image, missng source'));
    }

    try {
      const img = new Image();
      img.src = source;
      img.onload = () => {
        resolve(img);
      };
    } catch (e) {
      reject(e);
    }
  });
}

async function getImageData(imageSource, puzzle) {
  const image = await loadImage(imageSource);
  const canvas = {
    source: document.createElement('canvas'),
    destination: document.createElement('canvas'),
  };
  const ctx = {
    source: canvas.source.getContext('2d'),
    destination: canvas.destination.getContext('2d'),
  };
  const size = [image.width / puzzle.width, image.height / puzzle.height];

  // Draw the image so that we can extract image data from it
  canvas.source.width = image.width;
  canvas.source.height = image.height;
  ctx.source.drawImage(image, 0, 0);

  // Prep the destination canvas to be the size of a singe puzzle piece
  canvas.destination.width = size[0];
  canvas.destination.height = size[1];

  // We render "shapes", shapes are made up of one or more pieces. Starting
  // point is a one-to-one grouping of shape per piece
  const { shapes, pieces } = puzzle.pieces.reduce(
    (acc, puzzlePiece) => {
      const [x, y] = puzzlePiece.location;
      // get imagedata from source, paint it to destination export to image
      const imageData = ctx.source.getImageData(
        size[0] * x,
        size[1] * y,
        size[0],
        size[1]
      );
      ctx.destination.clearRect(
        0,
        0,
        canvas.destination.width,
        canvas.destination.height
      );
      ctx.destination.putImageData(imageData, 0, 0);
      const dataURL = canvas.destination.toDataURL();
      const unsolved = Object.entries(
        pick(['top', 'bottom', 'left', 'right'], puzzlePiece)
      ).filter(([_, p]) => p != null);

      const shapeId = Object.keys(acc.shapes).length;

      const visualPiece = {
        ...puzzlePiece,
        loc: multiply(puzzlePiece.location, size),
        v: [[0, 0], [size[0], 0], [0, size[1]], [...size]],
        size,
        unsolved,
        dataURL,
        shapeId,
      };

      const shape = {
        id: shapeId,
        pieces: [visualPiece.id],
        loc: [...visualPiece.loc],
      };

      acc.shapes[shape.id] = shape;
      acc.pieces[visualPiece.id] = visualPiece;

      return acc;
    },
    { shapes: {}, pieces: {} }
  );

  return { shapes, size, image, pieces };
}

export const Main = () => {
  const [open, setOpen] = useState(true);
  const savedImage = localStorage.getItem('image');
  const [state, dispatch] = useReducer(reducer, {
    source: null,
    savedImage,
  });
  const store = { state, dispatch };
  const styles = useStyles();

  const handleGenerate = (width, height) => {
    const puzzle = jigsaw(width, height);
    getImageData(store.state.source, puzzle).then(
      ({ shapes, size, image, pieces }) => {
        store.dispatch({
          type: 'generate',
          payload: { puzzle, shapes, size, image, pieces },
        });
        setOpen(false);
      }
    );
  };

  return (
    <Container fixed>
      <Fab
        color="primary"
        className={styles.fab}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <AddIcon />
      </Fab>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Toolbar open={open} store={store} onGenerate={handleGenerate} />
      </Drawer>
      {(() => {
        if (store.state.puzzle) {
          return <Puzzle store={store} />;
        }

        if (!store.state.source) {
          return null;
        }

        return <Preview source={store.state.source} />;
      })()}
    </Container>
  );
};
