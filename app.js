const BALL_SIZE = 16;
const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 1000;
const GRID_X = 50;
const GRID_Y = 50;

const Engine = Matter.Engine,
  Render = Matter.Render,
  Bodies = Matter.Bodies,
  World = Matter.World,
  Body = Matter.Body;

// Engine
const engine = Engine.create({
  timing: { timeScale: 1 }
});
Engine.run(engine);

// Render
const render = Render.create({
  element: document.querySelector('.target'),
  engine: engine,
  options: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    wireframes: false,
    background: 'black'
  }
});
Render.run(render);

// Bodies
const ground = Bodies.rectangle(0, CANVAS_HEIGHT, CANVAS_WIDTH * 3, 9, {
  id: 9999,
  isStatic: true,
  collisionFilter: { group: 'ground' }
});
const indicator = Bodies.circle(BALL_SIZE, BALL_SIZE, BALL_SIZE, {
  isStatic: true,
  collisionFilter: { group: 'ball' }
});
const grids = [];
for (let i = 1; i < CANVAS_HEIGHT / GRID_Y - 1; i++) {
  for (let j = 1; j < CANVAS_WIDTH / GRID_X + 1; j++) {
    let x = j * GRID_X - BALL_SIZE * 1.5;
    const y = i * GRID_Y;
    if (i % 2 == 0) {
      x -= GRID_X / 2;
    }
    const grid = Bodies.polygon(x, y, 7, BALL_SIZE / 1000, {
      isStatic: true
    });
    grids.push(grid);
  }
}
const leftWall = Bodies.rectangle(
  -1,
  CANVAS_HEIGHT / 2 + BALL_SIZE * 2,
  1,
  CANVAS_HEIGHT,
  {
    isStatic: true
  }
);
const rightWall = Bodies.rectangle(
  CANVAS_WIDTH + 1,
  CANVAS_HEIGHT / 2 + BALL_SIZE * 2,
  1,
  CANVAS_HEIGHT,
  {
    isStatic: true
  }
);

// World
World.add(engine.world, [
  ground,
  ...grids,
  indicator,
  leftWall,
  rightWall
]);

// Drop Balls
let ballCount = 0;
let message = "";
function dropBalls(position, quantity) {
  const balls = [];
  for (let i = 0; i < quantity; i++) {
    ballCount++;
    if (ballCount > 100) {
      ballCount--;
      message = "(Press Reset!)";
      break;
    }
    const restitution = Math.random() * (0.55 - 0.5) + 0.5;
    const dropX = position;
    const ball = Bodies.circle(dropX, BALL_SIZE, BALL_SIZE, {
      restitution,
      collisionFilter: { group: 'ball' },
      friction: 0.9
    });
    ball.size = BALL_SIZE;
    ball.restitution = restitution;
    ball.dropX = position;
    balls.push(ball);
  }
  World.add(engine.world, balls);
}

// Event
let x = 0;
const canvas = document.querySelector('canvas');
const events = {
  mousemove(event) {
    x = event.offsetX;
    // Body
    Body.setPosition(indicator, { x: x, y: BALL_SIZE });
    document.querySelector('.x-position').innerHTML = `x: ${x}, ball count: ${ballCount} ${message}`;
  },
  click() {
    dropBalls(x, 1);
  }
}
for (const event in events) {
  canvas.addEventListener(event, events[event]);
}

// Reset Button (jslfree080)
document.querySelector('#reset').addEventListener('click', function () {
  try {
    while (outputs.length) {
      outputs.pop();
    }
  } catch (e) { }
});
