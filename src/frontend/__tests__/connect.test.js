// Test connecting of pieces
import test from 'ava';
import { updateLocations, findConnections } from '../reducer.js';

test('location updates', t => {
  const state = {
    shapes: {
      0: {
        id: 0,
        pieces: [0, 1],
        loc: [0, 0],
      },
    },
    pieces: {
      0: {
        id: 0,
        loc: [0, 0],
      },
      1: {
        id: 1,
        loc: [10, 0],
      },
    },
  };

  let result = updateLocations(state, {
    type: 'move',
    payload: { id: 0, offset: { x: 100, y: 100 } },
  });

  t.like(result.pieces[0], {
    loc: [100, 100],
  });
  t.like(result.pieces[1], {
    loc: [110, 100],
  });

  t.like(result.shapes[0], {
    loc: [100, 100],
  });

  result = updateLocations(state, {
    type: 'move',
    payload: { id: 0, offset: { x: 50, y: 50 } },
  });

  t.like(result.pieces[0], {
    loc: [50, 50],
  });
  t.like(result.pieces[1], {
    loc: [60, 50],
  });

  t.like(result.shapes[0], {
    loc: [50, 50],
  });
});

test.only('piece connection', t => {
  const state = {
    threshold: 10,
    shapes: {
      0: {
        id: 0,
        pieces: [0],
        loc: [0, 0],
      },
      1: {
        id: 1,
        pieces: [1],
        loc: [40, 40],
      },
    },
    pieces: {
      0: {
        id: 0,
        shapeId: 0,
        loc: [0, 0],
        v: [
          [0, 0],
          [10, 0],
          [0, 10],
          [10, 10],
        ],
        unsolved: [['right', { id: 1 }]],
      },
      1: {
        id: 1,
        shapeId: 1,
        loc: [40, 40],
        v: [
          [0, 0],
          [10, 0],
          [0, 10],
          [10, 10],
        ],
        unsolved: [['left', { id: 0 }]],
      },
    },
  };

  let action = {
    type: 'move',
    payload: { id: 0, offset: { x: 32, y: 40 } },
  };
  let result = findConnections(updateLocations(state, action), action);
});
