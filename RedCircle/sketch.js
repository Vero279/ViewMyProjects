// Interactive Circle with:
// - Mouse click to change color
// - Drag circle to move it + spawn red-toned fading bursts
// - Keyboard: ↑ ↓ or W S to smoothly increase/decrease circle size (slider updates)
// - Slider to resize (also updates via keyboard)
// - Reset button
// - Responsive canvas

let circleX, circleY;
let circleSize = 100;
let circleColor;

let sizeSlider, resetButton, sliderLabel, hintDiv;

// Burst particle system
let bursts = [];

// Dragging flag
let isDraggingCircle = false;

// Smooth keyboard size control flags
let sizeUpPressed = false;
let sizeDownPressed = false;
const SIZE_SPEED = 2.5;   // pixels per frame

// Default values
const DEFAULT_REL_X = 100 / 400;
const DEFAULT_REL_Y = 100 / 400;
const DEFAULT_SIZE = 100;
const DEFAULT_COLOR = [255, 0, 0];

function setup() {
  const canvasSize = getResponsiveSize();
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('p5canvasContainer');

  circleX = width * DEFAULT_REL_X;
  circleY = height * DEFAULT_REL_Y;
  circleSize = DEFAULT_SIZE;
  circleColor = [...DEFAULT_COLOR];

  // --- GUI ---
  const maxSize = min(width, height) * 0.8;
  sizeSlider = createSlider(20, maxSize, DEFAULT_SIZE);
  sizeSlider.position(20, height + 10);
  sizeSlider.style('width', '200px');
  sizeSlider.input(() => {
    circleSize = sizeSlider.value();
    updateSliderLabel();
    constrainPosition();
  });

  sliderLabel = createSpan('Size: ' + circleSize + 'px');
  sliderLabel.position(sizeSlider.x + sizeSlider.width + 10, height + 10);
  sliderLabel.style('background', 'rgba(0,0,0,0.6)');
  sliderLabel.style('color', 'white');
  sliderLabel.style('padding', '4px 8px');
  sliderLabel.style('border-radius', '20px');
  sliderLabel.style('font-size', '14px');

  resetButton = createButton('⟳ Reset');
  resetButton.position(20, height + 45);
  resetButton.style('padding', '6px 16px');
  resetButton.style('font-weight', 'bold');
  resetButton.style('background', '#2c3e66');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('border-radius', '30px');
  resetButton.style('cursor', 'pointer');
  resetButton.mousePressed(resetCircle);

  hintDiv = createDiv('🎮 Click = color | Drag = move + red bursts | Hold ↑ ↓ or W S = smooth resize');
  hintDiv.position(20, height + 85);
  hintDiv.style('font-family', 'sans-serif');
  hintDiv.style('font-size', '12px');
  hintDiv.style('color', '#444');
  hintDiv.style('background', 'rgba(255,255,200,0.8)');
  hintDiv.style('padding', '4px 12px');
  hintDiv.style('border-radius', '20px');
  hintDiv.style('display', 'inline-block');
}

function draw() {
  background(220);

  // 1. Smooth keyboard size adjustment (every frame)
  updateSizeFromKeyboard();

  // 2. Draw circle
  fill(circleColor[0], circleColor[1], circleColor[2]);
  noStroke();
  circle(circleX, circleY, circleSize);
  strokeWeight(1);
  stroke(100);
  noFill();
  circle(circleX, circleY, circleSize + 2);
  noStroke();
  fill(0, 0, 0, 80);
  circle(circleX, circleY, 5);

  // 3. Draw and update fading bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    let b = bursts[i];
    fill(b.color[0], b.color[1], b.color[2], b.alpha);
    noStroke();
    circle(b.x, b.y, b.size);
    b.alpha -= 6;
    b.size *= 0.96;
    b.life--;
    if (b.alpha <= 0 || b.life <= 0) {
      bursts.splice(i, 1);
    }
  }
}

// --- Smooth keyboard size control ---
function updateSizeFromKeyboard() {
  let newSize = circleSize;
  if (sizeUpPressed) {
    newSize = min(sizeSlider.elt.max, circleSize + SIZE_SPEED);
  }
  if (sizeDownPressed) {
    newSize = max(sizeSlider.elt.min, circleSize - SIZE_SPEED);
  }
  if (newSize !== circleSize) {
    circleSize = newSize;
    sizeSlider.value(circleSize);
    updateSliderLabel();
    constrainPosition();
  }
}

function keyPressed() {
  let handled = false;
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
    sizeUpPressed = true;
    handled = true;
  } 
  else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
    sizeDownPressed = true;
    handled = true;
  }
  if (handled) {
    return false; // prevent page scrolling
  }
}

function keyReleased() {
  let handled = false;
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
    sizeUpPressed = false;
    handled = true;
  }
  else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
    sizeDownPressed = false;
    handled = true;
  }
  if (handled) return false;
}

// --- Mouse interaction: click changes color, drag moves circle + bursts ---
function mousePressed() {
  if (isMouseOverCircle()) {
    // Click changes color
    circleColor = [random(100, 255), random(100, 255), random(100, 255)];
    isDraggingCircle = true;
    return false;
  }
}

function mouseDragged() {
  if (isDraggingCircle) {
    // Move circle to mouse position (with boundary)
    circleX = mouseX;
    circleY = mouseY;
    constrainPosition();
    
    // Generate red-tone bursts sized 25%-50% of current circle diameter
    createBurst(mouseX, mouseY);
    return false;
  }
}

function mouseReleased() {
  isDraggingCircle = false;
}

function createBurst(x, y) {
  let burstCount = floor(random(6, 14));
  let minBurstSize = circleSize * 0.25;
  let maxBurstSize = circleSize * 0.5;
  for (let i = 0; i < burstCount; i++) {
    let offsetX = random(-12, 12);
    let offsetY = random(-12, 12);
    let particleSize = random(minBurstSize, maxBurstSize);
    // Red tones: red high, green and blue low
    let redVal = random(180, 255);
    let greenVal = random(0, 80);
    let blueVal = random(0, 80);
    let particle = {
      x: x + offsetX,
      y: y + offsetY,
      size: particleSize,
      alpha: 220,
      life: 40,
      color: [redVal, greenVal, blueVal]
    };
    bursts.push(particle);
  }
}

function isMouseOverCircle() {
  const d = dist(mouseX, mouseY, circleX, circleY);
  return d < circleSize / 2;
}

function constrainPosition() {
  const radius = circleSize / 2;
  circleX = constrain(circleX, radius, width - radius);
  circleY = constrain(circleY, radius, height - radius);
}

function resetCircle() {
  circleX = width * DEFAULT_REL_X;
  circleY = height * DEFAULT_REL_Y;
  circleSize = DEFAULT_SIZE;
  circleColor = [...DEFAULT_COLOR];
  sizeSlider.value(DEFAULT_SIZE);
  updateSliderLabel();
  constrainPosition();
  bursts = [];
  isDraggingCircle = false;
  // Release keyboard flags to avoid stuck resizing
  sizeUpPressed = false;
  sizeDownPressed = false;
}

function updateSliderLabel() {
  sliderLabel.html('Size: ' + nf(circleSize, 0, 0) + 'px');
}

// --- Responsive canvas ---
function getResponsiveSize() {
  const margin = 40;
  const maxWidth = windowWidth - margin;
  const maxHeight = windowHeight - margin - 150;
  return min(maxWidth, maxHeight, 700);
}

function windowResized() {
  const newSize = getResponsiveSize();
  if (newSize === width && newSize === height) return;
  
  const relX = circleX / width;
  const relY = circleY / height;
  
  resizeCanvas(newSize, newSize);
  circleX = relX * width;
  circleY = relY * height;
  
  const maxAllowed = min(width, height) * 0.8;
  sizeSlider.attribute('max', maxAllowed);
  if (circleSize > maxAllowed) {
    circleSize = maxAllowed;
    sizeSlider.value(circleSize);
    updateSliderLabel();
  }
  constrainPosition();
  
  sizeSlider.position(20, height + 10);
  sliderLabel.position(sizeSlider.x + sizeSlider.width + 10, height + 10);
  resetButton.position(20, height + 45);
  if (hintDiv) hintDiv.position(20, height + 85);
}