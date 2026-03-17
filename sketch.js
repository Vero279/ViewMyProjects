// ─── Project URLs — replace placeholders with your GitHub links ───
const projects = [
  {
    label: "Red Circle",
    url: "https://vero279.github.io/RedCircle/", // 🔴 replace
    accent: [220, 60, 60],
  },
  {
    label: "Blue Square",
    url: "https://vero279.github.io/BlueSquare/", // 🔵 replace
    accent: [60, 120, 220],
  },
];

// ─── Layout constants ─────────────────────────────────────────────
const BTN_W = 260;
const BTN_H = 64;
const BTN_GAP = 32;
const CORNER_R = 6;

let buttons = [];
let hoveredIndex = -1;

// ─── p5 setup ─────────────────────────────────────────────────────
function setup() {
  let cnv = createCanvas(600, 340);
  cnv.parent("canvas-container");
  textFont("monospace");
  buildButtons();
}

function buildButtons() {
  let totalH = projects.length * BTN_H + (projects.length - 1) * BTN_GAP;
  let startY = (height - totalH) / 2;

  buttons = projects.map((p, i) => ({
    ...p,
    x: (width - BTN_W) / 2,
    y: startY + i * (BTN_H + BTN_GAP),
    w: BTN_W,
    h: BTN_H,
  }));
}

// ─── p5 draw ──────────────────────────────────────────────────────
function draw() {
  background(13);

  // Subtle grid texture
  stroke(255, 255, 255, 8);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += 28) line(x, 0, x, height);
  for (let y = 0; y < height; y += 28) line(0, y, width, y);

  // Title
  noStroke();
  fill(255, 255, 255, 140);
  textSize(11);
  textAlign(CENTER, TOP);
  text("SELECT A PROJECT", width / 2, 28);

  // Decorative line under title
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  line(width / 2 - 60, 48, width / 2 + 60, 48);

  // Buttons
  buttons.forEach((btn, i) => drawButton(btn, i));
}

function drawButton(btn, i) {
  let isHover = i === hoveredIndex;
  let [r, g, b] = btn.accent;

  // Glow behind button on hover
  if (isHover) {
    noStroke();
    for (let spread = 24; spread > 0; spread -= 4) {
      fill(r, g, b, map(spread, 0, 24, 0, 18));
      rect(
        btn.x - spread,
        btn.y - spread,
        btn.w + spread * 2,
        btn.h + spread * 2,
        CORNER_R + spread
      );
    }
  }

  // Button body
  noStroke();
  fill(isHover ? color(r * 0.2, g * 0.2, b * 0.2) : color(22, 22, 22));
  rect(btn.x, btn.y, btn.w, btn.h, CORNER_R);

  // Border
  strokeWeight(isHover ? 1.5 : 1);
  stroke(r, g, b, isHover ? 255 : 90);
  noFill();
  rect(btn.x, btn.y, btn.w, btn.h, CORNER_R);

  // Accent stripe on left edge
  noStroke();
  fill(r, g, b, isHover ? 255 : 160);
  rect(btn.x, btn.y + 12, 3, btn.h - 24, 2);

  // Label
  noStroke();
  fill(isHover ? color(r, g, b) : color(200));
  textSize(14);
  textAlign(LEFT, CENTER);
  text(btn.label, btn.x + 22, btn.y + btn.h / 2);

  // Arrow indicator
  fill(r, g, b, isHover ? 220 : 80);
  textSize(14);
  textAlign(RIGHT, CENTER);
  text("↗", btn.x + btn.w - 16, btn.y + btn.h / 2);
}

// ─── Interaction ──────────────────────────────────────────────────
function mouseMoved() {
  hoveredIndex = buttons.findIndex((btn) => isOverButton(btn));
  cursor(hoveredIndex >= 0 ? HAND : 'default');
}

function mousePressed() {
  let clicked = buttons.findIndex((btn) => isOverButton(btn));
  if (clicked >= 0) {
    window.open(buttons[clicked].url, "_blank");
  }
}

function isOverButton(btn) {
  return (
    mouseX >= btn.x &&
    mouseX <= btn.x + btn.w &&
    mouseY >= btn.y &&
    mouseY <= btn.y + btn.h
  );
}