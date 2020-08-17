// jigsaw puzzle or whatever
let uuid = 0;

// Generate puzzle piece. One at a time, recursively
function generate(x, y, w, h, pieces) {
  if (x >= w) {
    generate(0, y + 1, w, h, pieces);
    return null;
  }

  if (y >= h) {
    return null;
  }
  const loc = (x, y) => {
    // bounds check
    if (x < 0 || y < 0 || x >= w || y >= h) {
      return -1;
    }

    return y * w + x;
  };

  const piece = { id: ++uuid };
  piece.location = [x, y];
  pieces[loc(x, y)] = piece;

  piece.right = generate(x + 1, y, w, h, pieces);

  // left & top should already exist!
  piece.left = pieces[loc(x - 1, y)];
  piece.top = pieces[loc(x, y - 1)];

  // Set references
  if (piece.top) {
    piece.top.bottom = piece;
  }

  return piece;
}

export default function jigsaw(width, height) {
  // start at root
  const pieces = [];
  const root = generate(0, 0, width, height, pieces);

  const at = (x, y) => {
    return pieces[y * width + x];
  };

  return {
    width,
    height,
    pieces,
    at,
    test(piece) {},
  };
}
