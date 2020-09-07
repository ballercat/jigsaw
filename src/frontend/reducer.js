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

const mapById = items =>
  items.reduce((a, v) => {
    a[v.id] = v;
    return a;
  }, {});
const inverseEdge = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};
const solveEdge = (edge, unsolved) =>
  unsolved.filter(([unsolvedEdge]) => {
    return unsolvedEdge !== edge;
  });

export const connect = (state, action) => {
  const { threshold } = state;
  const verticalTest = (a, b) => {
    return (
      distance(add(a.loc, a.v[1]), add(b.loc, b.v[0])) <= threshold &&
      distance(add(a.loc, a.v[3]), add(b.loc, b.v[2])) <= threshold
    );
  };

  const horizontalTest = (a, b) => {
    return (
      distance(add(a.loc, a.v[0]), add(b.loc, b.v[2])) <= threshold &&
      distance(add(a.loc, a.v[1]), add(b.loc, b.v[3])) <= threshold
    );
  };

  return state.shapes[action.payload.id].pieces.reduce((a, pieceId) => {
    const piece = state.pieces[pieceId];

    const { unsolved, matchedPieces, affectedShapes } = piece.unsolved.reduce(
      (a, v) => {
        const [edge, { id }] = v;
        const test = state.pieces[id];
        let match = false;
        if (edge === 'top') {
          match = horizontalTest(piece, test);
        } else if (edge === 'bottom') {
          match = horizontalTest(test, piece);
        } else if (edge === 'left') {
          match = verticalTest(test, piece);
        } else if (edge === 'right') {
          match = verticalTest(piece, test);
        }

        if (match) {
          a.matchedPieces = {
            ...a.matchedPieces,
            ...mapById(
              state.shapes[test.shapeId].pieces.map(swapId => ({
                ...state.pieces[swapId],
                shapeId: piece.shapeId,
                unsolved: solveEdge(
                  inverseEdge[edge],
                  state.pieces[swapId].unsolved
                ),
              }))
            ),
          };
          a.affectedShapes = {
            ...a.affectedShapes,
            [piece.shapeId]: {
              ...state.shapes[piece.shapeId],
              pieces: [
                ...state.shapes[piece.shapeId].pieces,
                ...state.shapes[test.shapeId].pieces,
              ],
            },
            [test.shapeId]: {
              ...state.shapes[test.shapeId],
              pieces: [],
            },
          };
        } else {
          a.unsolved.push(v);
        }

        return a;
      },
      { unsolved: [], matchedPieces: {}, affectedShapes: {} }
    );

    return {
      ...a,
      shapes: {
        ...a.shapes,
        ...affectedShapes,
      },
      pieces: {
        ...a.pieces,
        ...matchedPieces,
        [pieceId]: {
          ...piece,
          unsolved,
        },
      },
    };
  }, state);
};
