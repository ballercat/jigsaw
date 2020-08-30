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
import { add, multiply } from '../vector';

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
      };
    case 'move': {
      const { id, offset } = action.payload;
      const { shapes, size } = state;
      // find if the item is next to one of it's neighbors
      const shape = {
        ...shapes[id],

        loc: [offset.x, offset.y],
      };
      const result = {};

      if (shape.pieces[0].top) {
        const top = shapes[shape.pieces[0].top.id];
        result.top =
          distance(add(shape.loc, shape.v[0]), add(top.loc, top.v[2])) < 5 &&
          distance(add(shape.loc, shape.v[1]), add(top.loc, top.v[3])) < 5;
      }
      if (shape.pieces[0].bottom) {
        const bottom = shapes[shape.pieces[0].bottom.id];
        result.bottom =
          distance(add(shape.loc, shape.v[2]), add(bottom.loc, bottom.v[0])) <
            5 &&
          distance(add(shape.loc, shape.v[3]), add(bottom.loc, bottom.v[1])) <
            5;
      }
      if (shape.pieces[0].left) {
        const left = shapes[shape.pieces[0].left.id];
        result.left =
          distance(add(shape.loc, shape.v[0]), add(left.loc, left.v[1])) < 5 &&
          distance(add(shape.loc, shape.v[2]), add(left.loc, left.v[3])) < 5;
      }
      if (shape.pieces[0].right) {
        const right = shapes[shape.pieces[0].right.id];
        result.right =
          distance(add(shape.loc, shape.v[1]), add(right.loc, right.v[0])) <
            5 &&
          distance(add(shape.loc, shape.v[3]), add(right.loc, right.v[2])) < 5;
      }

      console.log(result);

      return {
        ...state,
        shapes: {
          ...shapes,
          [id]: shape,
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
  const shapes = puzzle.pieces.reduce((acc, piece) => {
    const [x, y] = piece.location;
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

    acc[piece.id] = {
      id: piece.id,
      pieces: [piece],
      dataURL: canvas.destination.toDataURL(),
      loc: multiply(piece.location, size),
      v: [[0, 0], [size[0], 0], [0, size[1]], [...size]],
    };

    return acc;
  }, {});

  return { shapes, size, image };
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
    getImageData(store.state.source, puzzle).then(({ shapes, size, image }) => {
      store.dispatch({
        type: 'generate',
        payload: { puzzle, shapes, size, image },
      });
      setOpen(false);
    });
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
