// ========== RECTANGLE PROPERTIES ==========
let rectX = 100;
let rectY = 100;
let rectW = 100;
let rectH = 100;
let rectColor;          // initial blue

// Movement flags for smooth keyboard control
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
const MOVE_SPEED = 3;   // pixels per frame

// GUI elements
let widthSlider, heightSlider;
let resetButton;
let widthLabel, heightLabel;

function setup() {
  // Responsive canvas size
  let canvasWidth = constrain(windowWidth - 60, 400, 1200);
  let canvasHeight = constrain(windowHeight - 180, 400, 800);
  createCanvas(canvasWidth, canvasHeight);
  
  rectColor = color(0, 0, 255);   // original blue
  
  // ---- CREATE GUI CONTROLS ----
  let controlDiv = createDiv();
  controlDiv.class('controls');
  
  // Width slider
  let widthControl = createDiv();
  widthControl.parent(controlDiv);
  createSpan('Width: ').parent(widthControl);
  widthSlider = createSlider(20, 300, rectW, 1);
  widthSlider.parent(widthControl);
  widthLabel = createSpan(` ${rectW}px`);
  widthLabel.parent(widthControl);
  
  // Height slider
  let heightControl = createDiv();
  heightControl.parent(controlDiv);
  createSpan('Height: ').parent(heightControl);
  heightSlider = createSlider(20, 300, rectH, 1);
  heightSlider.parent(heightControl);
  heightLabel = createSpan(` ${rectH}px`);
  heightLabel.parent(heightControl);
  
  // Reset button
  resetButton = createButton('⟳ Reset Rectangle');
  resetButton.parent(controlDiv);
  resetButton.mousePressed(resetRectangle);
  
  // Instruction text (updated with WASD)
  let info = createP('✨ Click rectangle → random color &nbsp;&nbsp;|&nbsp;&nbsp; 🎮 Arrow keys / WASD → move smoothly &nbsp;&nbsp;|&nbsp;&nbsp; 🎛️ Sliders → resize &nbsp;&nbsp;|&nbsp;&nbsp; 💨 Corners breathe');
  info.class('info-text');
  info.parent(document.body);
  
  constrainRectangle();
}

function draw() {
  // ---- UPDATE SIZE FROM SLIDERS (GUI) ----
  rectW = widthSlider.value();
  rectH = heightSlider.value();
  widthLabel.html(` ${rectW}px`);
  heightLabel.html(` ${rectH}px`);
  
  // ---- SMOOTH MOVEMENT FROM KEYBOARD (arrow keys + WASD) ----
  if (moveLeft)  rectX -= MOVE_SPEED;
  if (moveRight) rectX += MOVE_SPEED;
  if (moveUp)    rectY -= MOVE_SPEED;
  if (moveDown)  rectY += MOVE_SPEED;
  constrainRectangle();   // keep inside canvas
  
  // ---- DRAW BACKGROUND ----
  background(220);
  
  // ---- ANIMATION: breathing rounded corners ----
  // Corner radius pulsates between 5 and 25 pixels
  let cornerRadius = 10 + sin(frameCount * 0.05) * 8;
  
  // Draw rectangle with rounded corners (animation)
  fill(rectColor);
  noStroke();
  rect(rectX, rectY, rectW, rectH, cornerRadius);
  
  // Optional subtle outline
  stroke(0);
  noFill();
  rect(rectX, rectY, rectW, rectH, cornerRadius);
  noStroke();
  
  // Display position & size (user feedback)
  fill(0);
  textSize(14);
  text(`Position: (${rectX}, ${rectY})  |  Size: ${rectW}×${rectH}`, 12, 25);
}

// ========== MOUSE INTERACTION ==========
// Click on rectangle → random color (preserved)
function mousePressed() {
  let mouseOverRect = (mouseX > rectX && mouseX < rectX + rectW &&
                       mouseY > rectY && mouseY < rectY + rectH);
  if (mouseOverRect) {
    rectColor = color(random(255), random(255), random(255));
  }
}

// ========== KEYBOARD INTERACTION (SMOOTH + WASD) ==========
function keyPressed() {
  // Arrow keys
  if (keyCode === LEFT_ARROW)  moveLeft = true;
  if (keyCode === RIGHT_ARROW) moveRight = true;
  if (keyCode === UP_ARROW)    moveUp = true;
  if (keyCode === DOWN_ARROW)  moveDown = true;
  
  // WASD (lowercase or uppercase)
  if (key === 'a' || key === 'A') moveLeft = true;
  if (key === 'd' || key === 'D') moveRight = true;
  if (key === 'w' || key === 'W') moveUp = true;
  if (key === 's' || key === 'S') moveDown = true;
  
  // Prevent page scrolling with arrow/WASD keys
  return false;
}

function keyReleased() {
  // Arrow keys
  if (keyCode === LEFT_ARROW)  moveLeft = false;
  if (keyCode === RIGHT_ARROW) moveRight = false;
  if (keyCode === UP_ARROW)    moveUp = false;
  if (keyCode === DOWN_ARROW)  moveDown = false;
  
  // WASD
  if (key === 'a' || key === 'A') moveLeft = false;
  if (key === 'd' || key === 'D') moveRight = false;
  if (key === 'w' || key === 'W') moveUp = false;
  if (key === 's' || key === 'S') moveDown = false;
  
  return false;
}

// ========== HELPER FUNCTIONS ==========
// Keep rectangle fully inside canvas bounds
function constrainRectangle() {
  rectX = constrain(rectX, 0, width - rectW);
  rectY = constrain(rectY, 0, height - rectH);
}

// Reset to original values (preserve existing functionality)
function resetRectangle() {
  rectX = 100;
  rectY = 100;
  rectW = 100;
  rectH = 100;
  rectColor = color(0, 0, 255);   // back to original blue
  
  widthSlider.value(rectW);
  heightSlider.value(rectH);
  constrainRectangle();
}

// ========== RESPONSIVE DESIGN ==========
function windowResized() {
  let newWidth = constrain(windowWidth - 60, 400, 1200);
  let newHeight = constrain(windowHeight - 180, 400, 800);
  resizeCanvas(newWidth, newHeight);
  constrainRectangle();
}