import React, { useReducer, useState } from 'react';
import jigsaw from '../jigsaw';
import { Puzzle } from './Puzzle';
import { Toolbar } from './Toolbar';
import './main.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'load-image':
      return {
        ...state,
        ...action.payload,
      };
    case 'generate':
      const puzzle = jigsaw(...action.payload);
      return {
        ...state,
        puzzle,
      };
    default:
      return state;
  }
};

export const Main = () => {
  const [open, setOpen] = useState(true);
  const savedImage = localStorage.getItem('image');
  const [state, dispatch] = useReducer(reducer, {
    source: null,
    savedImage,
  });
  const store = { state, dispatch };

  return (
    <Container fixed>
      <Fab
        onClick={() => {
          setOpen(!open);
        }}
      >
        <AddIcon />
      </Fab>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Toolbar open={open} store={store} />
      </Drawer>
      <Puzzle store={store} />
    </Container>
  );
};
