import { add, subtract } from '../vector';

export const updateLocations = (state, action) => {
  // find all moved pieces, updae their locations
  const shape = state.shapes[action.payload.id];
  const delta = subtract(Object.values(action.payload.offset), shape.loc);

  const updatedPieces = shape.pieces.reduce((a, pieceId) => {
    const piece = state.pieces[pieceId];
    a[piece.id] = {
      ...piece,
      loc: add(piece.loc, delta),
    };

    return a;
  }, {});

  return {
    ...state,
    shapes: {
      ...state.shapes,
      [action.payload.id]: {
        ...state.shapes[action.payload.id],
        loc: Object.values(action.payload.offset),
      },
    },
    pieces: {
      ...state.pieces,
      ...updatedPieces,
    },
  };
};

const distance = (v1, v2) => {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const findConnections = (state, action) => {
  const { threshold } = state;
  const verticalTest = (a, b) => {
    return (
      distance(add(a.loc, a.v[1]), add(b.loc, b.v[0])) <= threshold &&
      distance(add(a.loc, a.v[3]), add(b.loc, b.v[2])) <= threshold
    );
  };

  return state.shapes[action.payload.id].pieces.reduce((a, pieceId) => {
    const piece = state.pieces[pieceId];

    const { unsolved, matched } = piece.unsolved.reduce(
      (a, v) => {
        const [edge, { id }] = v;
        const test = state.pieces[id];
        let match = false;
        if (edge === 'top') {
          match =
            distance(add(piece.loc, piece.v[0]), add(test.loc, test.v[2])) <
              5 &&
            distance(add(piece.loc, piece.v[1]), add(test.loc, test.v[3])) < 5;
        } else if (edge === 'bottom') {
          match =
            distance(add(piece.loc, piece.v[2]), add(test.loc, test.v[0])) <
              5 &&
            distance(add(piece.loc, piece.v[3]), add(test.loc, test.v[1])) < 5;
        } else if (edge === 'left') {
          match =
            distance(add(piece.loc, piece.v[0]), add(test.loc, test.v[1])) <
              5 &&
            distance(add(piece.loc, piece.v[2]), add(test.loc, test.v[3])) < 5;
        } else if (edge === 'right') {
          match = verticalTest(piece, test);
        }

        if (match) {
          a.matched = [...a.matched, ...state.shapes[test.shapeId].pieces];
        } else {
          a.unsolved.push(v);
        }

        return a;
      },
      { unsolved: [], matched: [] }
    );

    return {
      ...a,
      pieces: {
        [pieceId]: {
          ...piece,
          unsolved,
        },
      },
    };
  }, state);
};
