let gameState = {
  currentLevel: 0,
  shotsLeft: MAX_SHOTS,
  phase: 'idle',
  ball: { x: 0, y: 0, vx: 0, vy: 0 },
  dragStart: null,
  dragCurrent: null,
  trail: [],
  hasWon: false,
  replayTrail: [],
  isReplaying: false,
  replayIndex: 0,
  replayTimeAcc: 0,
  replayBall: { x: 0, y: 0 },
};

function getCurrentLevel() {
  return LEVELS[gameState.currentLevel];
}

function resetBall() {
  const level = getCurrentLevel();
  gameState.ball.x = level.ballStart.x;
  gameState.ball.y = level.ballStart.y;
  gameState.ball.vx = 0;
  gameState.ball.vy = 0;
  gameState.trail = [];
}

function setPhase(phase) {
  gameState.phase = phase;
}

function decrementShots() {
  gameState.shotsLeft--;
  return gameState.shotsLeft;
}

function startLevelState(levelIndex) {
  gameState.currentLevel = levelIndex;
  gameState.shotsLeft = MAX_SHOTS;
  gameState.phase = 'idle';
  gameState.hasWon = false;
  gameState.trail = [];
  gameState.dragStart = null;
  gameState.dragCurrent = null;
  resetReplay();
  resetBall();
}

function setWon() {
  gameState.phase = 'won';
  gameState.hasWon = true;
}

function setLost() {
  gameState.phase = 'lost';
}

function addTrailPoint(x, y) {
  gameState.trail.push({ x, y });
  if (gameState.trail.length > 80) gameState.trail.shift();
}

function addReplayPoint(x, y) {
  if (gameState.replayTrail.length < REPLAY_TRAIL_MAX) {
    gameState.replayTrail.push({ x, y });
  }
}

function resetReplay() {
  gameState.replayTrail = [];
  gameState.isReplaying = false;
  gameState.replayIndex = 0;
  gameState.replayTimeAcc = 0;
}

function startReplay() {
  if (gameState.replayTrail.length < 2) return false;
  gameState.isReplaying = true;
  gameState.replayIndex = 0;
  gameState.replayTimeAcc = 0;
  gameState.replayBall.x = gameState.replayTrail[0].x;
  gameState.replayBall.y = gameState.replayTrail[0].y;
  return true;
}

function stopReplay() {
  gameState.isReplaying = false;
}
