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

const useStyles = makeStyles(() => ({
  fab: {
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed',
  },
}));

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
        moved: {},
      };
    case 'move': {
      const { id, offset } = action.payload;
      const { pieceSize } = state;
      const shapes = {
        ...state.shapes,
        [item.id]: {
          ...state.shapes[id],
          location: {
            top: offset.x,
            left: offset.y,
          },
        },
      };
      return {
        ...state,
        imageData,
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
  const pieceSize = {
    width: image.width / puzzle.width,
    height: image.height / puzzle.height,
  };

  // Draw the image so that we can extract image data from it
  canvas.source.width = image.width;
  canvas.source.height = image.height;
  ctx.source.drawImage(image, 0, 0);

  // Prep the destination canvas to be the size of a singe puzzle piece
  canvas.destination.width = pieceSize.width;
  canvas.destination.height = pieceSize.height;

  // We render "shapes", shapes are made up of one or more pieces. Starting
  // point is a one-to-one grouping of shape per piece
  const shapes = puzzle.pieces.reduce((acc, piece) => {
    const [x, y] = piece.location;
    // get imagedata from source, paint it to destination export to image
    const imageData = ctx.source.getImageData(
      pieceSize.width * x,
      pieceSize.height * y,
      pieceSize.width,
      pieceSize.height
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
      location: {
        top: piece.location[1] * pieceSize.height,
        left: piece.location[0] * pieceSize.width,
      },
    };

    return acc;
  }, {});

  return { shapes, pieceSize, image };
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
      ({ shapes, pieceSize, image }) => {
        store.dispatch({
          type: 'generate',
          payload: { puzzle, shapes, pieceSize, image },
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
