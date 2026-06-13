function circleLineCollision(cx, cy, r, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  let t = ((cx - x1) * dx + (cy - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  const distX = cx - closestX;
  const distY = cy - closestY;
  const dist = Math.sqrt(distX * distX + distY * distY);

  if (dist < r) {
    let nx, ny;
    if (dist > 0.001) {
      nx = distX / dist;
      ny = distY / dist;
    } else {
      nx = -dy / Math.sqrt(lenSq);
      ny = dx / Math.sqrt(lenSq);
    }
    return { hit: true, normal: { x: nx, y: ny }, penetration: r - dist };
  }
  return { hit: false };
}

function checkHoleCollision(ball, hole) {
  const dx = ball.x - hole.x;
  const dy = ball.y - hole.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < hole.r - 2;
}

function updatePhysicsStep(ball, walls, dt) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= FRICTION;
  ball.vy *= FRICTION;

  for (const wall of walls) {
    const result = circleLineCollision(ball.x, ball.y, BALL_RADIUS, wall.x1, wall.y1, wall.x2, wall.y2);
    if (result.hit) {
      ball.x += result.normal.x * result.penetration;
      ball.y += result.normal.y * result.penetration;

      const bounce = wall.type === 'bumper' ? BUMPER_BOUNCE : WALL_BOUNCE;
      const dot = ball.vx * result.normal.x + ball.vy * result.normal.y;
      ball.vx = (ball.vx - 2 * dot * result.normal.x) * bounce;
      ball.vy = (ball.vy - 2 * dot * result.normal.y) * bounce;

      if (wall.type === 'bumper') {
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed < 12) {
          const boost = 12 / Math.max(speed, 0.1);
          ball.vx *= boost;
          ball.vy *= boost;
        }
      }
    }
  }

  const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
  return speed;
}

function predictTrajectory(startX, startY, vx, vy, walls, hole, maxSteps = 200) {
  const points = [];
  let x = startX;
  let y = startY;
  let cvx = vx;
  let cvy = vy;

  for (let i = 0; i < maxSteps; i++) {
    x += cvx;
    y += cvy;
    cvx *= FRICTION;
    cvy *= FRICTION;

    for (const wall of walls) {
      const result = circleLineCollision(x, y, BALL_RADIUS, wall.x1, wall.y1, wall.x2, wall.y2);
      if (result.hit) {
        x += result.normal.x * result.penetration;
        y += result.normal.y * result.penetration;

        const bounce = wall.type === 'bumper' ? BUMPER_BOUNCE : WALL_BOUNCE;
        const dot = cvx * result.normal.x + cvy * result.normal.y;
        cvx = (cvx - 2 * dot * result.normal.x) * bounce;
        cvy = (cvy - 2 * dot * result.normal.y) * bounce;

        if (wall.type === 'bumper') {
          const speed = Math.sqrt(cvx * cvx + cvy * cvy);
          if (speed < 12) {
            const boost = 12 / Math.max(speed, 0.1);
            cvx *= boost;
            cvy *= boost;
          }
        }
        break;
      }
    }

    const dx = x - hole.x;
    const dy = y - hole.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < hole.r - 2) {
      points.push({ x, y, inHole: true });
      break;
    }

    points.push({ x, y, inHole: false });

    const speed = Math.sqrt(cvx * cvx + cvy * cvy);
    if (speed < 0.3) break;
  }

  return points;
}
