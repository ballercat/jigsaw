import test from 'ava';
import jigsaw from '..';

test('jigsaw generator', t => {
  const puzzle = jigsaw(3, 3);

  t.is(typeof puzzle, 'object');

  t.assert(Array.isArray(puzzle.pieces));
  t.is(puzzle.pieces.length, 9);
});

test('pieces', t => {
  const puzzle = jigsaw(3, 3);

  // a corner piece has only two set edges
  let piece = puzzle.at(0, 0);
  t.assert(piece.right);
  t.assert(piece.bottom);
  t.assert(piece.left == null);
  t.assert(piece.top == null);

  piece = puzzle.at(2, 2);
  t.assert(piece.right == null);
  t.assert(piece.bottom == null);
  t.assert(piece.left);
  t.assert(piece.top);

  piece = puzzle.at(2, 0);
  t.assert(piece.right == null);
  t.assert(piece.bottom);
  t.assert(piece.left);
  t.assert(piece.top == null);

  piece = puzzle.at(0, 2);
  t.assert(piece.right);
  t.assert(piece.bottom == null);
  t.assert(piece.left == null);
  t.assert(piece.top);

  // a 3x3 grid should have a center piece with 4 edges
  piece = puzzle.at(1, 1);
  t.assert(piece.left);
  t.assert(piece.bottom);
  t.assert(piece.left);
  t.assert(piece.top);
});
