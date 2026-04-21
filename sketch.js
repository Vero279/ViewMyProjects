/**
 * ProjectLauncher - Interactive project showcase using p5.js
 * Renders an animated, interactive UI for navigating between projects.
 * 
 * Dependencies: p5.js, config.js
 * Configuration: See config.js for project definitions
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION & STATE
// ═══════════════════════════════════════════════════════════════════

const AppState = {
  projects: [],
  buttons: [],
  hoveredIndex: -1,
  isReady: false,
  lastResizeTime: 0,
  resizeTimeout: null,
};

const UIConfig = {
  grid: {
    spacing: 28,
  },
  title: {
    text: "SELECT A PROJECT",
    offsetY: 28,
    lineY: 48,
    lineLength: 60,
  },
  glow: {
    maxSpread: 24,
    spreadStep: 4,
    maxAlpha: 18,
  },
};

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize the application
 * Called after config.js is loaded
 */
function initApp() {
  try {
    if (typeof AppConfig === 'undefined' || !AppConfig.projects) {
      console.error('Configuration error: AppConfig.projects not defined');
      showErrorScreen('Configuration Error');
      return;
    }
    AppState.projects = AppConfig.projects;
    AppState.isReady = true;
  } catch (error) {
    console.error('Initialization error:', error);
    showErrorScreen('Initialization Error');
  }
}

/**
 * Display error screen when app fails to initialize
 */
function showErrorScreen(message) {
  background(13);
  fill(255, 68, 68);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(message, width / 2, height / 2);
  AppState.isReady = false;
}

// ═══════════════════════════════════════════════════════════════════
// P5.JS LIFECYCLE
// ═══════════════════════════════════════════════════════════════════

/**
 * p5.js setup function
 * Initializes canvas and layout
 */
function setup() {
  const container = document.getElementById('canvas-container');
  const width_val = min(window.innerWidth, 900);
  const height_val = min(window.innerHeight, 600);
  
  let cnv = createCanvas(width_val, height_val);
  cnv.parent('canvas-container');
  
  // Set monospace font for UI text
  textFont('monospace');
  
  // Initialize app configuration
  initApp();
  
  // Build button layout
  if (AppState.isReady) {
    buildButtons();
  }
  
  // Handle window resize
  window.addEventListener('resize', handleWindowResize);
}

/**
 * p5.js draw function
 * Called continuously to render the canvas
 */
function draw() {
  if (!AppState.isReady) {
    background(13);
    fill(200, 100, 100);
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Failed to load projects', width / 2, height / 2);
    return;
  }

  // Background
  background(13);

  // Render grid texture
  drawGrid();

  // Render title section
  drawTitleSection();

  // Render buttons
  AppState.buttons.forEach((btn, i) => drawButton(btn, i));
}

// ═══════════════════════════════════════════════════════════════════
// LAYOUT & RENDERING
// ═══════════════════════════════════════════════════════════════════

/**
 * Build button positions based on project count and canvas size
 */
function buildButtons() {
  const btnWidth = 260;
  const btnHeight = 64;
  const btnGap = 32;

  const totalHeight = AppState.projects.length * btnHeight + 
                      (AppState.projects.length - 1) * btnGap;
  const startY = (height - totalHeight) / 2;

  AppState.buttons = AppState.projects.map((project, index) => ({
    ...project,
    x: (width - btnWidth) / 2,
    y: startY + index * (btnHeight + btnGap),
    width: btnWidth,
    height: btnHeight,
  }));
}

/**
 * Draw subtle grid background texture
 */
function drawGrid() {
  stroke(255, 255, 255, 8);
  strokeWeight(0.5);
  
  for (let x = 0; x < width; x += UIConfig.grid.spacing) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += UIConfig.grid.spacing) {
    line(0, y, width, y);
  }
}

/**
 * Draw title and decorative elements
 */
function drawTitleSection() {
  // Title text
  noStroke();
  fill(255, 255, 255, 140);
  textSize(11);
  textAlign(CENTER, TOP);
  text(UIConfig.title.text, width / 2, UIConfig.title.offsetY);

  // Decorative line
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  line(
    width / 2 - UIConfig.title.lineLength,
    UIConfig.title.lineY,
    width / 2 + UIConfig.title.lineLength,
    UIConfig.title.lineY
  );
}

/**
 * Draw individual button with state-based styling
 * @param {Object} btn - Button object with position and style data
 * @param {number} index - Button index
 */
function drawButton(btn, index) {
  const isHovered = index === AppState.hoveredIndex;
  const [r, g, b] = btn.accent;
  const cornerRadius = 6;

  // Glow effect on hover
  if (isHovered) {
    drawButtonGlow(btn, r, g, b, cornerRadius);
  }

  // Button background
  noStroke();
  const bgColor = isHovered 
    ? color(r * 0.2, g * 0.2, b * 0.2)
    : color(22, 22, 22);
  fill(bgColor);
  rect(btn.x, btn.y, btn.width, btn.height, cornerRadius);

  // Button border
  strokeWeight(isHovered ? 1.5 : 1);
  stroke(r, g, b, isHovered ? 255 : 90);
  noFill();
  rect(btn.x, btn.y, btn.width, btn.height, cornerRadius);

  // Accent stripe
  drawAccentStripe(btn, r, g, b, isHovered);

  // Button label
  drawButtonLabel(btn, r, g, b, isHovered);

  // Arrow indicator
  drawArrowIndicator(btn, r, g, b, isHovered);
}

/**
 * Draw glow effect around button on hover
 */
function drawButtonGlow(btn, r, g, b, cornerRadius) {
  noStroke();
  for (let spread = UIConfig.glow.maxSpread; spread > 0; spread -= UIConfig.glow.spreadStep) {
    const alpha = map(spread, 0, UIConfig.glow.maxSpread, 0, UIConfig.glow.maxAlpha);
    fill(r, g, b, alpha);
    rect(
      btn.x - spread,
      btn.y - spread,
      btn.width + spread * 2,
      btn.height + spread * 2,
      cornerRadius + spread
    );
  }
}

/**
 * Draw colored accent stripe on button
 */
function drawAccentStripe(btn, r, g, b, isHovered) {
  noStroke();
  const stripeAlpha = isHovered ? 255 : 160;
  const stripeWidth = 3;
  const stripeMargin = 12;
  
  fill(r, g, b, stripeAlpha);
  rect(
    btn.x,
    btn.y + stripeMargin,
    stripeWidth,
    btn.height - stripeMargin * 2,
    2
  );
}

/**
 * Draw button label text
 */
function drawButtonLabel(btn, r, g, b, isHovered) {
  noStroke();
  const labelColor = isHovered ? color(r, g, b) : color(200);
  fill(labelColor);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(btn.label, btn.x + 22, btn.y + btn.height / 2);
}

/**
 * Draw arrow indicator on button
 */
function drawArrowIndicator(btn, r, g, b, isHovered) {
  const arrowAlpha = isHovered ? 220 : 80;
  fill(r, g, b, arrowAlpha);
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('↗', btn.x + btn.width - 16, btn.y + btn.height / 2);
}

// ═══════════════════════════════════════════════════════════════════
// INTERACTION HANDLERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Handle mouse movement - update hover state
 */
function mouseMoved() {
  if (!AppState.isReady) return;
  
  const newHoveredIndex = AppState.buttons.findIndex(btn => isPointInButton(mouseX, mouseY, btn));
  AppState.hoveredIndex = newHoveredIndex;
  
  // Update cursor style
  document.body.style.cursor = newHoveredIndex >= 0 ? 'pointer' : 'default';
}

/**
 * Handle mouse click - navigate to project URL
 */
function mousePressed() {
  if (!AppState.isReady) return;
  
  const clickedIndex = AppState.buttons.findIndex(btn => isPointInButton(mouseX, mouseY, btn));
  if (clickedIndex >= 0) {
    navigateToProject(AppState.buttons[clickedIndex].url);
  }
}

/**
 * Handle keyboard navigation - arrow keys and Enter
 */
function keyPressed() {
  if (!AppState.isReady) return;
  
  if (keyCode === UP_ARROW) {
    AppState.hoveredIndex = max(0, AppState.hoveredIndex - 1);
    return false;
  } else if (keyCode === DOWN_ARROW) {
    AppState.hoveredIndex = min(AppState.buttons.length - 1, AppState.hoveredIndex + 1);
    return false;
  } else if (keyCode === ENTER && AppState.hoveredIndex >= 0) {
    navigateToProject(AppState.buttons[AppState.hoveredIndex].url);
    return false;
  }
}

/**
 * Check if a point is within button bounds
 * @returns {boolean}
 */
function isPointInButton(px, py, btn) {
  return (
    px >= btn.x &&
    px <= btn.x + btn.width &&
    py >= btn.y &&
    py <= btn.y + btn.height
  );
}

/**
 * Navigate to project URL with error handling
 * @param {string} url - Project URL
 */
function navigateToProject(url) {
  try {
    if (!url || typeof url !== 'string') {
      console.error('Invalid URL:', url);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Navigation error:', error);
  }
}

/**
 * Handle window resize events
 */
function handleWindowResize() {
  clearTimeout(AppState.resizeTimeout);
  AppState.resizeTimeout = setTimeout(() => {
    if (AppState.isReady) {
      resizeCanvas(
        min(window.innerWidth, 900),
        min(window.innerHeight, 600)
      );
      buildButtons();
    }
  }, 250);
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION TRIGGER
// ═══════════════════════════════════════════════════════════════════

// Trigger initialization when config is loaded
if (typeof AppConfig !== 'undefined') {
  initApp();
}