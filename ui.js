let onRetryCallback = null;
let onNextCallback = null;
let onStartCallback = null;

function initUI(onRetry, onNext, onStart) {
  onRetryCallback = onRetry;
  onNextCallback = onNext;
  onStartCallback = onStart;

  document.getElementById('start-btn').addEventListener('click', () => {
    if (onStartCallback) onStartCallback();
  });

  document.getElementById('retry-btn').addEventListener('click', () => {
    if (onRetryCallback) onRetryCallback();
  });
  document.getElementById('next-btn').addEventListener('click', () => {
    if (onNextCallback) onNextCallback();
  });

  document.getElementById('win-retry-btn').addEventListener('click', () => {
    if (onRetryCallback) onRetryCallback();
  });
  document.getElementById('win-next-btn').addEventListener('click', () => {
    if (onNextCallback) onNextCallback();
  });

  document.getElementById('fail-retry-btn').addEventListener('click', () => {
    if (onRetryCallback) onRetryCallback();
  });

  document.getElementById('complete-restart-btn').addEventListener('click', () => {
    if (onStartCallback) onStartCallback();
  });
}

function updateHUD() {
  document.getElementById('level-display').textContent = `${gameState.currentLevel + 1} / ${LEVELS.length}`;
  document.getElementById('shots-display').textContent = gameState.shotsLeft;
  document.getElementById('next-btn').disabled = !gameState.hasWon;
}

function showWinScreen() {
  const isLastLevel = gameState.currentLevel >= LEVELS.length - 1;
  if (isLastLevel) {
    document.getElementById('complete-screen').classList.remove('hidden');
  } else {
    document.getElementById('win-screen').classList.remove('hidden');
  }
  updateHUD();
}

function showFailScreen() {
  document.getElementById('fail-screen').classList.remove('hidden');
}

function hideAllScreens() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('win-screen').classList.add('hidden');
  document.getElementById('fail-screen').classList.add('hidden');
  document.getElementById('complete-screen').classList.add('hidden');
}
