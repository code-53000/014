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
  resetReplay();
  addReplayPoint(gameState.ball.x, gameState.ball.y);
}

function startLevel(levelIndex) {
  startLevelState(levelIndex);
  hideAllScreens();
  hideSkipReplayButton();
  hideReplayVignette();
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

function finishReplayAndShowWin() {
  stopReplay();
  hideSkipReplayButton();
  hideReplayVignette();
  showWinScreen();
}

function skipReplayHandler() {
  if (gameState.isReplaying) {
    finishReplayAndShowWin();
  }
}

function updateReplay(dt) {
  if (!gameState.isReplaying) return;

  gameState.replayTimeAcc += dt * REPLAY_SPEED;

  while (gameState.replayTimeAcc >= 1) {
    gameState.replayTimeAcc -= 1;
    gameState.replayIndex++;
  }

  const total = gameState.replayTrail.length;

  if (gameState.replayIndex >= total - 1) {
    gameState.replayIndex = total - 1;
    const last = gameState.replayTrail[gameState.replayIndex];
    gameState.replayBall.x = last.x;
    gameState.replayBall.y = last.y;
    finishReplayAndShowWin();
    return;
  }

  const idx = Math.floor(gameState.replayIndex);
  const frac = gameState.replayTimeAcc;
  const a = gameState.replayTrail[idx];
  const b = gameState.replayTrail[Math.min(idx + 1, total - 1)];
  gameState.replayBall.x = a.x + (b.x - a.x) * frac;
  gameState.replayBall.y = a.y + (b.y - a.y) * frac;
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 16.67, 3);
  lastTime = timestamp;

  if (gameState.phase === 'flying') {
    const level = getCurrentLevel();
    addTrailPoint(gameState.ball.x, gameState.ball.y);
    addReplayPoint(gameState.ball.x, gameState.ball.y);

    const speed = updatePhysicsStep(gameState.ball, level.walls, dt);

    if (checkHoleCollision(gameState.ball, level.hole)) {
      addReplayPoint(gameState.ball.x, gameState.ball.y);
      setWon();
      if (startReplay()) {
        showSkipReplayButton();
        showReplayVignette();
      } else {
        showWinScreen();
      }
    } else if (speed < 0.3) {
      endShot();
    }
  }

  if (gameState.isReplaying) {
    updateReplay(dt);
  }

  render();
  requestAnimationFrame(gameLoop);
}

(function initGame() {
  const canvas = document.getElementById('game-canvas');

  initRenderer(canvas);
  initInput(canvas, handleShoot);
  initUI(retryLevel, nextLevel, startFromBeginning, skipReplayHandler);

  updateHUD();
  requestAnimationFrame(gameLoop);
})();
