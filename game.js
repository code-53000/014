// ==================== 向量工具 ====================
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

// ==================== 关卡数据 ====================
// 墙壁类型：wall(普通墙), bumper(弹板), slope(斜坡)
// 弹板弹性更高，斜坡是倾斜的普通墙
const LEVELS = [
  // 第1关：教学 - 直线弹射
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
  // 第2关：中间有柱子
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
  // 第3关：一次反弹
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
  // 第4关：双墙反弹
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
  // 第5关：斜坡
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
  // 第6关：固定弹板
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
  // 第7关：斜坡 + 弹板
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
  // 第8关：精准通道
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
  // 第9关：多重反弹
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
  // 第10关：终极挑战
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

// ==================== 游戏状态 ====================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const BALL_RADIUS = 12;
const MAX_POWER = 20;
const FRICTION = 0.997;
const WALL_BOUNCE = 0.9;
const BUMPER_BOUNCE = 1.6;
const MAX_SHOTS = 3;
const DRAG_SENSITIVITY = 0.12;
const GRAB_RADIUS = 50;

let gameState = {
  currentLevel: 0,
  shotsLeft: MAX_SHOTS,
  phase: 'idle', // idle | aiming | flying | won | lost
  ball: { x: 0, y: 0, vx: 0, vy: 0 },
  dragStart: null,
  dragCurrent: null,
  trail: [],
  hasWon: false,
};

// ==================== 碰撞检测 ====================
// 圆与线段碰撞，返回 { hit: bool, normal: vec, penetration: number }
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

// ==================== 物理更新 ====================
function updatePhysics(dt) {
  const ball = gameState.ball;
  const level = LEVELS[gameState.currentLevel];
  
  // 记录轨迹
  gameState.trail.push({ x: ball.x, y: ball.y });
  if (gameState.trail.length > 80) gameState.trail.shift();
  
  // 应用速度
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // 摩擦力
  ball.vx *= FRICTION;
  ball.vy *= FRICTION;
  
  // 墙壁碰撞
  for (const wall of level.walls) {
    const result = circleLineCollision(ball.x, ball.y, BALL_RADIUS, wall.x1, wall.y1, wall.x2, wall.y2);
    if (result.hit) {
      // 推出穿透
      ball.x += result.normal.x * result.penetration;
      ball.y += result.normal.y * result.penetration;
      
      // 反弹
      const bounce = wall.type === 'bumper' ? BUMPER_BOUNCE : WALL_BOUNCE;
      const dot = ball.vx * result.normal.x + ball.vy * result.normal.y;
      ball.vx = (ball.vx - 2 * dot * result.normal.x) * bounce;
      ball.vy = (ball.vy - 2 * dot * result.normal.y) * bounce;
      
      // 弹板额外推力
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
  
  // 检测进洞
  const hole = level.hole;
  const dx = ball.x - hole.x;
  const dy = ball.y - hole.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < hole.r - 2) {
    gameState.phase = 'won';
    gameState.hasWon = true;
    showWinScreen();
    return;
  }
  
  // 检测速度过小（停下）
  const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
  if (speed < 0.3) {
    endShot();
  }
}

function endShot() {
  if (gameState.phase !== 'flying') return;
  
  gameState.shotsLeft--;
  updateHUD();
  
  if (gameState.shotsLeft <= 0) {
    gameState.phase = 'lost';
    showFailScreen();
  } else {
    resetBall();
    gameState.phase = 'idle';
  }
}

// ==================== 轨迹预览 ====================
function predictTrajectory(startX, startY, vx, vy, maxSteps = 200) {
  const level = LEVELS[gameState.currentLevel];
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
    
    let collided = false;
    for (const wall of level.walls) {
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
        collided = true;
        break;
      }
    }
    
    // 检测进洞
    const hole = level.hole;
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

// ==================== 渲染 ====================
function render() {
  const level = LEVELS[gameState.currentLevel];
  
  // 清屏
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 背景网格
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
  
  // 绘制洞
  const hole = level.hole;
  // 外圈光晕
  const gradient = ctx.createRadialGradient(hole.x, hole.y, hole.r * 0.5, hole.x, hole.y, hole.r * 1.5);
  gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
  gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(hole.x, hole.y, hole.r * 1.5, 0, Math.PI * 2);
  ctx.fill();
  // 洞本体
  ctx.fillStyle = '#052e16';
  ctx.beginPath();
  ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 绘制墙壁
  for (const wall of level.walls) {
    drawWall(wall);
  }
  
  // 绘制轨迹
  if (gameState.phase === 'aiming' && gameState.dragStart && gameState.dragCurrent) {
    const dx = gameState.dragStart.x - gameState.dragCurrent.x;
    const dy = gameState.dragStart.y - gameState.dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) * DRAG_SENSITIVITY, MAX_POWER);
    const angle = Math.atan2(dy, dx);
    const vx = Math.cos(angle) * power;
    const vy = Math.sin(angle) * power;
    
    const points = predictTrajectory(gameState.ball.x, gameState.ball.y, vx, vy, 300);
    
    // 绘制拖拽方向线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(gameState.ball.x, gameState.ball.y);
    ctx.lineTo(gameState.ball.x + dx, gameState.ball.y + dy);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制轨迹点
    for (let i = 0; i < points.length; i += 3) {
      const p = points[i];
      const alpha = 0.8 - (i / points.length) * 0.6;
      if (p.inHole) {
        // 进洞点 - 绿色闪烁效果
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
    
    // 力度指示器
    const powerPercent = power / MAX_POWER;
    const barWidth = 120;
    const barHeight = 10;
    const barX = gameState.ball.x - barWidth / 2;
    const barY = gameState.ball.y + BALL_RADIUS + 20;
    
    // 背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 5);
    ctx.fill();
    
    // 力度条
    const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
    gradient.addColorStop(0, '#4ade80');
    gradient.addColorStop(0.5, '#fbbf24');
    gradient.addColorStop(1, '#ef4444');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(barX + 1, barY + 1, (barWidth - 2) * powerPercent, barHeight - 2, 4);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 5);
    ctx.stroke();
  }
  
  // 绘制飞行轨迹
  if (gameState.phase === 'flying' && gameState.trail.length > 1) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameState.trail[0].x, gameState.trail[0].y);
    for (let i = 1; i < gameState.trail.length; i++) {
      ctx.lineTo(gameState.trail[i].x, gameState.trail[i].y);
    }
    ctx.stroke();
  }
  
  // 绘制小球
  const ball = gameState.ball;
  
  // 呼吸光晕（仅在空闲状态）
  if (gameState.phase === 'idle') {
    const pulse = 0.5 + Math.sin(Date.now() / 500) * 0.3;
    const glowGradient = ctx.createRadialGradient(
      ball.x, ball.y, BALL_RADIUS,
      ball.x, ball.y, BALL_RADIUS + 20
    );
    glowGradient.addColorStop(0, `rgba(255, 159, 67, ${pulse * 0.4})`);
    glowGradient.addColorStop(1, 'rgba(255, 159, 67, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS + 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(ball.x + 2, ball.y + 4, BALL_RADIUS, BALL_RADIUS * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 球体
  const ballGradient = ctx.createRadialGradient(
    ball.x - 4, ball.y - 4, 2,
    ball.x, ball.y, BALL_RADIUS
  );
  ballGradient.addColorStop(0, '#ff9f43');
  ballGradient.addColorStop(0.5, '#e94560');
  ballGradient.addColorStop(1, '#c23a51');
  ctx.fillStyle = ballGradient;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  
  // 高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(ball.x - 4, ball.y - 4, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawWall(wall) {
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  
  if (wall.type === 'bumper') {
    // 弹板 - 橙红色发光
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
    // 斜坡 - 蓝紫色
    ctx.shadowColor = '#6c5ce7';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#a29bfe';
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#6c5ce7';
    // 画斜线条纹
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
    // 普通墙
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

// ==================== 游戏循环 ====================
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 16.67, 3);
  lastTime = timestamp;
  
  if (gameState.phase === 'flying') {
    updatePhysics(dt);
  }
  
  render();
  requestAnimationFrame(gameLoop);
}

// ==================== 输入处理 ====================
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
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

function isOnBall(pos) {
  const dx = pos.x - gameState.ball.x;
  const dy = pos.y - gameState.ball.y;
  return Math.sqrt(dx * dx + dy * dy) < BALL_RADIUS + 10;
}

function handleStart(e) {
  if (gameState.phase !== 'idle') return;
  
  const pos = getCanvasPos(e);
  
  const dx = pos.x - gameState.ball.x;
  const dy = pos.y - gameState.ball.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < GRAB_RADIUS) {
    gameState.phase = 'aiming';
    gameState.dragStart = { x: gameState.ball.x, y: gameState.ball.y };
    gameState.dragCurrent = pos;
    gameState.trail = [];
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
}

function handleMove(e) {
  if (gameState.phase !== 'aiming' && gameState.phase !== 'idle') return;
  
  const pos = getCanvasPos(e);
  
  if (gameState.phase === 'idle') {
    const dx = pos.x - gameState.ball.x;
    const dy = pos.y - gameState.ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    canvas.style.cursor = dist < GRAB_RADIUS ? 'grab' : 'default';
  }
  
  if (gameState.phase === 'aiming') {
    gameState.dragCurrent = pos;
  }
  e.preventDefault();
}

function handleEnd(e) {
  if (gameState.phase !== 'aiming') return;
  
  const pos = getCanvasPos(e);
  gameState.dragCurrent = pos;
  
  const dx = gameState.dragStart.x - pos.x;
  const dy = gameState.dragStart.y - pos.y;
  const power = Math.min(Math.sqrt(dx * dx + dy * dy) * DRAG_SENSITIVITY, MAX_POWER);
  
  if (power > 1) {
    const angle = Math.atan2(dy, dx);
    gameState.ball.vx = Math.cos(angle) * power;
    gameState.ball.vy = Math.sin(angle) * power;
    gameState.phase = 'flying';
    gameState.trail = [{ x: gameState.ball.x, y: gameState.ball.y }];
  } else {
    gameState.phase = 'idle';
  }
  
  gameState.dragStart = null;
  gameState.dragCurrent = null;
  canvas.style.cursor = 'grab';
  e.preventDefault();
}

canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('mouseleave', handleEnd);

canvas.addEventListener('touchstart', handleStart, { passive: false });
canvas.addEventListener('touchmove', handleMove, { passive: false });
canvas.addEventListener('touchend', handleEnd, { passive: false });

// ==================== UI 控制 ====================
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

function resetBall() {
  const level = LEVELS[gameState.currentLevel];
  gameState.ball.x = level.ballStart.x;
  gameState.ball.y = level.ballStart.y;
  gameState.ball.vx = 0;
  gameState.ball.vy = 0;
  gameState.trail = [];
}

function startLevel(levelIndex) {
  gameState.currentLevel = levelIndex;
  gameState.shotsLeft = MAX_SHOTS;
  gameState.phase = 'idle';
  gameState.hasWon = false;
  gameState.trail = [];
  resetBall();
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

// 按钮事件
document.getElementById('start-btn').addEventListener('click', () => {
  startLevel(0);
});

document.getElementById('retry-btn').addEventListener('click', retryLevel);
document.getElementById('next-btn').addEventListener('click', nextLevel);

document.getElementById('win-retry-btn').addEventListener('click', retryLevel);
document.getElementById('win-next-btn').addEventListener('click', nextLevel);

document.getElementById('fail-retry-btn').addEventListener('click', retryLevel);

document.getElementById('complete-restart-btn').addEventListener('click', () => {
  startLevel(0);
});

// ==================== 启动 ====================
requestAnimationFrame(gameLoop);
updateHUD();
