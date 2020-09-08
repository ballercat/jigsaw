// Test connecting of pieces
import test from 'ava';
import { updateLocations, connect } from '../reducer.js';

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

const baseState = {
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
    2: {
      id: 2,
      pieces: [2],
      loc: [100, 100],
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
      unsolved: [
        ['right', { id: 1 }],
        ['bottom', { id: 2 }],
      ],
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
    2: {
      id: 2,
      shapeId: 2,
      loc: [100, 100],
      v: [
        [0, 0],
        [10, 0],
        [0, 10],
        [10, 10],
      ],
      unsolved: [['top', { id: 0 }]],
    },
  },
};

test('vertical connections', t => {
  const moveRight = {
    type: 'move',
    payload: { id: 0, offset: { x: 32, y: 40 } },
  };
  let result = connect(updateLocations(baseState, moveRight), moveRight);

  t.like(result.shapes[0], {
    pieces: [0, 1],
  });

  // Two pieces matches, both are "solved" vertically
  t.like(result.pieces[0], {
    shapeId: 0,
    unsolved: [['bottom', { id: 2 }]],
  });
  t.like(result.pieces[1], {
    shapeId: 0,
    unsolved: [],
  });

  // unrelated piece is left alone
  t.like(result.pieces[2], {
    shapeId: 2,
    unsolved: [['top', { id: 0 }]],
  });

  // move the 2nd shape over to the left next to the first one
  const moveLeft = {
    type: 'move',
    payload: { id: 1, offset: { x: 20, y: 0 } },
  };

  result = connect(updateLocations(baseState, moveLeft), moveLeft);

  // Similar result as before. Two pieces matches, both are "solved" vertically
  t.like(result.pieces[0], {
    shapeId: 1,
    unsolved: [['bottom', { id: 2 }]],
  });
  t.like(result.pieces[1], {
    shapeId: 1,
    unsolved: [],
  });

  // unrelated piece is left alone
  t.like(result.pieces[2], {
    shapeId: 2,
    unsolved: [['top', { id: 0 }]],
  });
});

test('horizontal connections', t => {
  const moveTop = {
    type: 'move',
    payload: { id: 0, offset: { x: 100, y: 90 } },
  };
  let result = connect(updateLocations(baseState, moveTop), moveTop);

  t.like(result.shapes[0], {
    pieces: [0, 2],
  });

  // Two pieces matches, both are "solved" vertically
  t.like(result.pieces[0], {
    shapeId: 0,
    unsolved: [['right', { id: 1 }]],
  });
  t.like(result.pieces[2], {
    shapeId: 0,
    unsolved: [],
  });

  // unrelated piece is left alone
  t.like(result.pieces[1], {
    shapeId: 1,
    unsolved: [['left', { id: 0 }]],
  });

  const moveBottom = {
    type: 'move',
    payload: { id: 2, offset: { x: 0, y: 20 } },
  };
  result = connect(updateLocations(baseState, moveBottom), moveBottom);

  t.like(result.shapes[2], {
    pieces: [2, 0],
  });
  // Two pieces matches, both are "solved" vertically
  t.like(result.pieces[0], {
    shapeId: 2,
    unsolved: [['right', { id: 1 }]],
  });
  t.like(result.pieces[2], {
    shapeId: 2,
    unsolved: [],
  });

  // unrelated piece is left alone
  t.like(result.pieces[1], {
    shapeId: 1,
    unsolved: [['left', { id: 0 }]],
  });
});

test.only('multiple matches', t => {
  const customState = {
    ...baseState,
    shapes: {
      ...baseState.shapes,
      1: {
        ...baseState.shapes[1],
        pieces: [1, 2],
      },
    },
    pieces: {
      ...baseState.pieces,
      2: {
        ...baseState.pieces[2],
        shapeId: 1,
        loc: [30, 50],
      },
    },
  };

  const moveMatch = {
    type: 'move',
    payload: { id: 0, offset: { x: 32, y: 40 } },
  };

  let result = connect(updateLocations(customState, moveMatch), moveMatch);

  t.like(result.shapes[0], {
    pieces: [0, 1, 2],
  });

  t.like(result.pieces[0], {
    shapeId: 0,
    unsolved: [],
  });

  t.like(result.pieces[1], {
    shapeId: 0,
    unsolved: [],
  });

  t.like(result.pieces[2], {
    shapeId: 0,
    unsolved: [],
  });
});
