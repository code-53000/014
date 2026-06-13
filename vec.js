const Vec = {
  create(x, y) { return { x, y }; },
  add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; },
  sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; },
  mul(v, s) { return { x: v.x * s, y: v.y * s }; },
  dot(a, b) { return a.x * b.x + a.y * b.y; },
  len(v) { return Math.sqrt(v.x * v.x + v.y * v.y); },
  norm(v) {
    const l = Vec.len(v);
    return l > 0.0001 ? { x: v.x / l, y: v.y / l } : { x: 0, y: 0 };
  },
  dist(a, b) { return Vec.len(Vec.sub(a, b)); },
  reflect(v, n) {
    const d = Vec.dot(v, n);
    return { x: v.x - 2 * d * n.x, y: v.y - 2 * d * n.y };
  }
};
