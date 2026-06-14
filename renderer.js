let canvas, ctx;

function initRenderer(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
}

function drawWall(wall) {
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  if (wall.type === 'bumper') {
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffd93d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();
  } else if (wall.type === 'slope') {
    ctx.shadowColor = '#6c5ce7';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#a29bfe';
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#6c5ce7';
    const dx = wall.x2 - wall.x1;
    const dy = wall.y2 - wall.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    const stripes = Math.floor(len / 20);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 1; i < stripes; i++) {
      const t = i / stripes;
      const sx = wall.x1 + dx * t;
      const sy = wall.y1 + dy * t;
      ctx.beginPath();
      ctx.moveTo(sx + nx * 6, sy + ny * 6);
      ctx.lineTo(sx - nx * 6, sy - ny * 6);
      ctx.stroke();
    }
  } else {
    ctx.shadowColor = '#74b9ff';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#74b9ff';
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#dfe6e9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
}

function drawHole(hole) {
  const gradient = ctx.createRadialGradient(hole.x, hole.y, hole.r * 0.5, hole.x, hole.y, hole.r * 1.5);
  gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
  gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(hole.x, hole.y, hole.r * 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#052e16';
  ctx.beginPath();
  ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawTrajectoryPrediction() {
  if (gameState.phase !== 'aiming' || !gameState.dragStart || !gameState.dragCurrent) return;

  const dx = gameState.dragStart.x - gameState.dragCurrent.x;
  const dy = gameState.dragStart.y - gameState.dragCurrent.y;
  const power = Math.min(Math.sqrt(dx * dx + dy * dy) * DRAG_SENSITIVITY, MAX_POWER);
  const angle = Math.atan2(dy, dx);
  const vx = Math.cos(angle) * power;
  const vy = Math.sin(angle) * power;

  const level = getCurrentLevel();
  const points = predictTrajectory(
    gameState.ball.x, gameState.ball.y, vx, vy,
    level.walls, level.hole, 300
  );

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(gameState.ball.x, gameState.ball.y);
  ctx.lineTo(gameState.ball.x + dx, gameState.ball.y + dy);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < points.length; i += 3) {
    const p = points[i];
    const alpha = 0.8 - (i / points.length) * 0.6;
    if (p.inHole) {
      const pulse = 0.8 + Math.sin(Date.now() / 100) * 0.2;
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha * pulse})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const size = 4 - (i / points.length) * 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(2, size), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const powerPercent = power / MAX_POWER;
  const barWidth = 120;
  const barHeight = 10;
  const barX = gameState.ball.x - barWidth / 2;
  const barY = gameState.ball.y + BALL_RADIUS + 20;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, 5);
  ctx.fill();

  const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
  gradient.addColorStop(0, '#4ade80');
  gradient.addColorStop(0.5, '#fbbf24');
  gradient.addColorStop(1, '#ef4444');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(barX + 1, barY + 1, (barWidth - 2) * powerPercent, barHeight - 2, 4);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, 5);
  ctx.stroke();
}

function drawBallAt(x, y, isReplay) {
  if (gameState.phase === 'idle' && !isReplay) {
    const pulse = 0.5 + Math.sin(Date.now() / 500) * 0.3;
    const glowGradient = ctx.createRadialGradient(
      x, y, BALL_RADIUS,
      x, y, BALL_RADIUS + 20
    );
    glowGradient.addColorStop(0, `rgba(255, 159, 67, ${pulse * 0.4})`);
    glowGradient.addColorStop(1, 'rgba(255, 159, 67, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS + 20, 0, Math.PI * 2);
    ctx.fill();
  }

  if (isReplay) {
    const pulse = 0.7 + Math.sin(Date.now() / 150) * 0.3;
    const glowGradient = ctx.createRadialGradient(
      x, y, BALL_RADIUS * 0.5,
      x, y, BALL_RADIUS * 3
    );
    glowGradient.addColorStop(0, `rgba(74, 222, 128, ${pulse * 0.5})`);
    glowGradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 4, BALL_RADIUS, BALL_RADIUS * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  const ballGradient = ctx.createRadialGradient(
    x - 4, y - 4, 2,
    x, y, BALL_RADIUS
  );
  if (isReplay) {
    ballGradient.addColorStop(0, '#86efac');
    ballGradient.addColorStop(0.5, '#4ade80');
    ballGradient.addColorStop(1, '#22c55e');
  } else {
    ballGradient.addColorStop(0, '#ff9f43');
    ballGradient.addColorStop(0.5, '#e94560');
    ballGradient.addColorStop(1, '#c23a51');
  }
  ctx.fillStyle = ballGradient;
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(x - 4, y - 4, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawBall() {
  drawBallAt(gameState.ball.x, gameState.ball.y, false);
}

function drawReplayBall() {
  drawBallAt(gameState.replayBall.x, gameState.replayBall.y, true);
}

function drawFlyingTrail() {
  if (gameState.phase !== 'flying' || gameState.trail.length <= 1) return;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gameState.trail[0].x, gameState.trail[0].y);
  for (let i = 1; i < gameState.trail.length; i++) {
    ctx.lineTo(gameState.trail[i].x, gameState.trail[i].y);
  }
  ctx.stroke();
}

function drawReplayTrail() {
  const trail = gameState.replayTrail;
  if (!trail || trail.length < 2) return;

  const progressIdx = Math.floor(
    gameState.replayIndex + gameState.replayTimeAcc
  );
  const endIdx = Math.min(progressIdx, trail.length - 1);

  if (endIdx < 1) return;

  const gradient = ctx.createLinearGradient(
    trail[0].x, trail[0].y,
    trail[endIdx].x, trail[endIdx].y
  );
  gradient.addColorStop(0, 'rgba(74, 222, 128, 0.15)');
  gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.5)');
  gradient.addColorStop(1, 'rgba(74, 222, 128, 0.9)');

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);
  for (let i = 1; i <= endIdx; i++) {
    ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.stroke();

  for (let i = 0; i <= endIdx; i += 6) {
    const t = i / Math.max(1, endIdx);
    const alpha = 0.3 + t * 0.6;
    const size = 2 + t * 3;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = 1;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
}

function drawBackground() {
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function render() {
  const level = getCurrentLevel();

  drawBackground();
  drawHole(level.hole);

  for (const wall of level.walls) {
    drawWall(wall);
  }

  if (gameState.isReplaying) {
    drawReplayTrail();
    drawReplayBall();
  } else {
    drawTrajectoryPrediction();
    drawFlyingTrail();
    if (!(gameState.phase === 'won' || gameState.phase === 'lost')) {
      drawBall();
    }
  }
}
