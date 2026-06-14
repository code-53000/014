let inputCanvas;
let onShootCallback = null;

function initInput(canvasEl, onShoot) {
  inputCanvas = canvasEl;
  onShootCallback = onShoot;

  canvasEl.addEventListener('mousedown', handleStart);
  canvasEl.addEventListener('mousemove', handleMove);
  canvasEl.addEventListener('mouseup', handleEnd);
  canvasEl.addEventListener('mouseleave', handleEnd);

  canvasEl.addEventListener('touchstart', handleStart, { passive: false });
  canvasEl.addEventListener('touchmove', handleMove, { passive: false });
  canvasEl.addEventListener('touchend', handleEnd, { passive: false });
}

function getCanvasPos(e) {
  const rect = inputCanvas.getBoundingClientRect();
  const scaleX = inputCanvas.width / rect.width;
  const scaleY = inputCanvas.height / rect.height;

  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

function handleStart(e) {
  if (gameState.phase !== 'idle' || gameState.isReplaying) return;

  const pos = getCanvasPos(e);
  const dx = pos.x - gameState.ball.x;
  const dy = pos.y - gameState.ball.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < GRAB_RADIUS) {
    gameState.phase = 'aiming';
    gameState.dragStart = { x: gameState.ball.x, y: gameState.ball.y };
    gameState.dragCurrent = pos;
    gameState.trail = [];
    inputCanvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
}

function handleMove(e) {
  if (gameState.isReplaying) return;
  if (gameState.phase !== 'aiming' && gameState.phase !== 'idle') return;

  const pos = getCanvasPos(e);

  if (gameState.phase === 'idle') {
    const dx = pos.x - gameState.ball.x;
    const dy = pos.y - gameState.ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    inputCanvas.style.cursor = dist < GRAB_RADIUS ? 'grab' : 'default';
  }

  if (gameState.phase === 'aiming') {
    gameState.dragCurrent = pos;
  }
  e.preventDefault();
}

function handleEnd(e) {
  if (gameState.isReplaying) return;
  if (gameState.phase !== 'aiming') return;

  const pos = getCanvasPos(e);
  gameState.dragCurrent = pos;

  const dx = gameState.dragStart.x - pos.x;
  const dy = gameState.dragStart.y - pos.y;
  const power = Math.min(Math.sqrt(dx * dx + dy * dy) * DRAG_SENSITIVITY, MAX_POWER);

  if (power > 1) {
    const angle = Math.atan2(dy, dx);
    if (onShootCallback) {
      onShootCallback(Math.cos(angle) * power, Math.sin(angle) * power);
    }
  } else {
    gameState.phase = 'idle';
  }

  gameState.dragStart = null;
  gameState.dragCurrent = null;
  inputCanvas.style.cursor = 'grab';
  e.preventDefault();
}
