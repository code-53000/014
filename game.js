let lastTime = 0;

function endShot() {
  if (gameState.phase !== 'flying') return;

  decrementShots();
  updateHUD();

  if (gameState.shotsLeft <= 0) {
    setLost();
    showFailScreen();
  } else {
    resetBall();
    setPhase('idle');
  }
}

function handleShoot(vx, vy) {
  gameState.ball.vx = vx;
  gameState.ball.vy = vy;
  setPhase('flying');
  gameState.trail = [{ x: gameState.ball.x, y: gameState.ball.y }];
}

function startLevel(levelIndex) {
  startLevelState(levelIndex);
  hideAllScreens();
  updateHUD();
}

function retryLevel() {
  startLevel(gameState.currentLevel);
}

function nextLevel() {
  if (gameState.currentLevel < LEVELS.length - 1) {
    startLevel(gameState.currentLevel + 1);
  }
}

function startFromBeginning() {
  startLevel(0);
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 16.67, 3);
  lastTime = timestamp;

  if (gameState.phase === 'flying') {
    const level = getCurrentLevel();
    addTrailPoint(gameState.ball.x, gameState.ball.y);

    const speed = updatePhysicsStep(gameState.ball, level.walls, dt);

    if (checkHoleCollision(gameState.ball, level.hole)) {
      setWon();
      showWinScreen();
    } else if (speed < 0.3) {
      endShot();
    }
  }

  render();
  requestAnimationFrame(gameLoop);
}

(function initGame() {
  const canvas = document.getElementById('game-canvas');

  initRenderer(canvas);
  initInput(canvas, handleShoot);
  initUI(retryLevel, nextLevel, startFromBeginning);

  updateHUD();
  requestAnimationFrame(gameLoop);
})();
