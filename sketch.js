// ─── Animated background: floating rose & violet petals ───────────────
// Replaces the old button-based navigation with a subtle decorative canvas.


let petals = [];
const PETAL_COUNT = 60;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvas-container');
  cnv.style('display', 'block');
  noStroke();

  // Create initial petals
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Clear with a very dark, slightly transparent background for trail effect
  background(8, 9, 13, 25);

  // Update and display petals
  for (let p of petals) {
    p.update();
    p.display();
  }
}

// ─── Petal class ──────────────────────────────────────────────────────
class Petal {
  constructor() {
    this.reset();
    // Start at random positions across the screen
    this.y = random(height);
  }

  reset() {
    this.x = random(-50, width + 50);
    this.y = random(-100, -20);
    this.size = random(6, 18);
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(0.4, 1.4);
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.02, 0.02);
    this.wobble = random(0.5, 1.5);
    this.wobbleSpeed = random(0.005, 0.02);
    this.alpha = random(30, 90);
    // 60% chance of rose (red), 40% violet (blue)
    if (random() < 0.6) {
      this.color = color(200, 40, 50, this.alpha);   // rose red
      this.type = 'rose';
    } else {
      this.color = color(120, 100, 220, this.alpha); // violet blue
      this.type = 'violet';
    }
  }

  update() {
    // Floating downward with gentle horizontal sway
    this.x += this.speedX + sin(frameCount * this.wobbleSpeed + this.y * 0.01) * this.wobble * 0.3;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;

    // Reset when off screen
    if (this.y > height + 50) {
      this.reset();
    }
    // Wrap horizontally
    if (this.x > width + 50) this.x = -50;
    if (this.x < -50) this.x = width + 50;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    if (this.type === 'rose') {
      // Simple rose petal shape (elongated ellipse)
      fill(red(this.color), green(this.color), blue(this.color), this.alpha);
      noStroke();
      for (let i = 0; i < 5; i++) {
        push();
        rotate(i * TWO_PI / 5);
        ellipse(0, -this.size * 0.5, this.size * 0.3, this.size * 0.7);
        pop();
      }
      // Center dot
      fill(180, 20, 30, this.alpha * 0.8);
      circle(0, 0, this.size * 0.35);
    } else {
      // Violet petal shape
      fill(red(this.color), green(this.color), blue(this.color), this.alpha);
      noStroke();
      for (let i = 0; i < 5; i++) {
        push();
        rotate(i * TWO_PI / 5);
        ellipse(0, -this.size * 0.45, this.size * 0.35, this.size * 0.65);
        pop();
      }
      fill(140, 120, 240, this.alpha * 0.8);
      circle(0, 0, this.size * 0.3);
    }
    pop();
  }
}

// ─── Fallback projects (used if config.js is missing) ─────────────────
const fallbackProjects = [
  {
    label: 'Red Roses',
    url: 'RedCircle/index.html',
    arrowUrl: 'https://github.com/Vero279/RedCircle/',
    accent: [220, 60, 60],
  },
  {
    label: 'Blue Violets',
    url: 'BlueSquare/index.html',
    arrowUrl: 'https://github.com/Vero279/BlueSquare/',
    accent: [60, 120, 220],
  },
];

function getProjects() {
  return typeof AppConfig !== 'undefined' && Array.isArray(AppConfig.projects)
    ? AppConfig.projects
    : fallbackProjects;
}
