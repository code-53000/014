const LEVELS = [
  {
    name: "初来乍到",
    ballStart: { x: 120, y: 300 },
    hole: { x: 680, y: 300, r: 28 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
    ]
  },
  {
    name: "绕柱而行",
    ballStart: { x: 120, y: 300 },
    hole: { x: 680, y: 300, r: 26 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'wall', x1: 400, y1: 200, x2: 400, y2: 400 },
    ]
  },
  {
    name: "借力打力",
    ballStart: { x: 120, y: 480 },
    hole: { x: 680, y: 480, r: 26 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'wall', x1: 300, y1: 300, x2: 500, y2: 300 },
      { type: 'wall', x1: 500, y1: 300, x2: 500, y2: 500 },
    ]
  },
  {
    name: "辗转腾挪",
    ballStart: { x: 120, y: 120 },
    hole: { x: 680, y: 480, r: 24 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'wall', x1: 250, y1: 200, x2: 250, y2: 450 },
      { type: 'wall', x1: 550, y1: 150, x2: 550, y2: 400 },
    ]
  },
  {
    name: "顺坡而下",
    ballStart: { x: 120, y: 150 },
    hole: { x: 680, y: 500, r: 26 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'slope', x1: 200, y1: 400, x2: 500, y2: 200 },
    ]
  },
  {
    name: "弹射起步",
    ballStart: { x: 120, y: 500 },
    hole: { x: 680, y: 120, r: 24 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'bumper', x1: 250, y1: 520, x2: 450, y2: 520 },
      { type: 'wall', x1: 300, y1: 200, x2: 600, y2: 200 },
    ]
  },
  {
    name: "珠联璧合",
    ballStart: { x: 100, y: 300 },
    hole: { x: 700, y: 500, r: 24 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'slope', x1: 300, y1: 150, x2: 500, y2: 350 },
      { type: 'bumper', x1: 550, y1: 450, x2: 700, y2: 450 },
      { type: 'wall', x1: 200, y1: 450, x2: 200, y2: 560 },
    ]
  },
  {
    name: "狭路相逢",
    ballStart: { x: 100, y: 300 },
    hole: { x: 700, y: 300, r: 22 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'wall', x1: 300, y1: 40, x2: 300, y2: 220 },
      { type: 'wall', x1: 300, y1: 380, x2: 300, y2: 560 },
      { type: 'wall', x1: 500, y1: 40, x2: 500, y2: 220 },
      { type: 'wall', x1: 500, y1: 380, x2: 500, y2: 560 },
    ]
  },
  {
    name: "迂回战术",
    ballStart: { x: 100, y: 100 },
    hole: { x: 100, y: 500, r: 24 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'wall', x1: 200, y1: 150, x2: 600, y2: 150 },
      { type: 'wall', x1: 200, y1: 450, x2: 600, y2: 450 },
      { type: 'bumper', x1: 600, y1: 250, x2: 600, y2: 350 },
    ]
  },
  {
    name: "终极考验",
    ballStart: { x: 100, y: 500 },
    hole: { x: 700, y: 100, r: 22 },
    walls: [
      { type: 'wall', x1: 40, y1: 40, x2: 760, y2: 40 },
      { type: 'wall', x1: 760, y1: 40, x2: 760, y2: 560 },
      { type: 'wall', x1: 760, y1: 560, x2: 40, y2: 560 },
      { type: 'wall', x1: 40, y1: 560, x2: 40, y2: 40 },
      { type: 'slope', x1: 200, y1: 200, x2: 400, y2: 400 },
      { type: 'bumper', x1: 500, y1: 300, x2: 500, y2: 500 },
      { type: 'wall', x1: 250, y1: 40, x2: 250, y2: 150 },
      { type: 'wall', x1: 550, y1: 40, x2: 550, y2: 200 },
      { type: 'wall', x1: 600, y1: 100, x2: 760, y2: 100 },
    ]
  },
];
