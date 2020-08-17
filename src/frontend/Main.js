import React, { useReducer } from 'react';
import jigsaw from '../jigsaw';
import { Puzzle } from './Puzzle';
import { Toolbar } from './Toolbar';
import './main.css';

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
  const savedImage = localStorage.getItem('image');
  const [state, dispatch] = useReducer(reducer, {
    source: null,
    savedImage,
  });
  const store = { state, dispatch };

  return (
    <div className="Container">
      <Toolbar store={store} />
      <Puzzle store={store} />
    </div>
  );
};
