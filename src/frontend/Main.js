import React, { useReducer } from 'react';
import { Puzzle, actions as puzzleActions } from './Puzzle';
import { Toolbar } from './Toolbar';
import './main.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      const savedImage = localStorage.getItem('image');
      return {
        imageBlock: {
          source: null,
          savedImage,
        },
      };
    case 'load-image':
      return {
        ...state,
        image: action.payload.source,
        imageBlock: {
          ...state.imageBlock,
          ...action.payload,
        },
      };
    case 'generate':
      const puzzle = jigsaw(10, 10);
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
    imageBlock: { source: null, savedImage },
  });
  const store = { state, dispatch };

  return (
    <div className="Container">
      <Toolbar store={store} />
      <Puzzle store={store} />
    </div>
  );
};
