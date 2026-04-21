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
    drawErrorState();
    return;
  }

  // Background with subtle gradient
  background(10, 14, 39);
  
  // Add subtle noise/texture overlay
  drawBackgroundGradient();

  // Render grid texture
  drawGrid();

  // Render title section
  drawTitleSection();

  // Render buttons
  AppState.buttons.forEach((btn, i) => drawButton(btn, i));
}

/**
 * Draw error state
 */
function drawErrorState() {
  background(10, 14, 39);
  fill(255, 107, 107);
  textSize(16);
  textAlign(CENTER, CENTER);
  text('Failed to load projects', width / 2, height / 2);
}

/**
 * Draw subtle background gradient overlay
 */
function drawBackgroundGradient() {
  noStroke();
  // Create a subtle gradient from top-left to bottom-right
  for (let i = 0; i < width; i++) {
    let gradientColor = lerpColor(
      color(10, 20, 55, 0),
      color(0, 40, 80, 15),
      i / width
    );
    stroke(gradientColor);
    line(i, 0, i, height);
  }
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
  stroke(0, 191, 255, 6);  // Cyan grid with low opacity
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
  fill(232, 240, 255, 160);  // Light blue
  textSize(11);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(UIConfig.title.text, width / 2, UIConfig.title.offsetY);
  textStyle(NORMAL);

  // Decorative line with gradient effect
  stroke(0, 191, 255, 50);  // Cyan
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
  const cornerRadius = 8;

  // Glow effect on hover
  if (isHovered) {
    drawButtonGlow(btn, r, g, b, cornerRadius);
  }

  // Button background - elegant dark with subtle tint
  noStroke();
  const bgColor = isHovered 
    ? color(r * 0.15, g * 0.15, b * 0.15, 200)
    : color(15, 20, 50, 180);
  fill(bgColor);
  rect(btn.x, btn.y, btn.width, btn.height, cornerRadius);

  // Button border - elegant and minimal
  strokeWeight(isHovered ? 1.5 : 1);
  stroke(r, g, b, isHovered ? 200 : 80);
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
  
  // Create multiple layers for smooth, elegant glow
  const glowLayers = [
    { spread: 32, alpha: 8 },
    { spread: 20, alpha: 15 },
    { spread: 10, alpha: 20 },
  ];
  
  glowLayers.forEach(layer => {
    const alpha = map(layer.spread, 32, 0, layer.alpha, 0);
    fill(r, g, b, alpha);
    rect(
      btn.x - layer.spread,
      btn.y - layer.spread,
      btn.width + layer.spread * 2,
      btn.height + layer.spread * 2,
      cornerRadius + layer.spread
    );
  });
}

/**
 * Draw colored accent stripe on button
 */
function drawAccentStripe(btn, r, g, b, isHovered) {
  noStroke();
  const stripeAlpha = isHovered ? 200 : 140;
  const stripeWidth = 3;
  const stripeMargin = 14;
  
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
  const labelColor = isHovered ? color(r, g, b, 255) : color(168, 184, 216);
  fill(labelColor);
  textSize(14);
  textAlign(LEFT, CENTER);
  textStyle(isHovered ? BOLD : NORMAL);
  text(btn.label, btn.x + 22, btn.y + btn.height / 2);
  textStyle(NORMAL);
}

/**
 * Draw arrow indicator on button
 */
function drawArrowIndicator(btn, r, g, b, isHovered) {
  const arrowAlpha = isHovered ? 220 : 100;
  fill(r, g, b, arrowAlpha);
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('↗', btn.x + btn.width - 18, btn.y + btn.height / 2);
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