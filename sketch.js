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
    text: "ISTEC 2026 - Projects",
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
  fill(255, 107, 107, 220);
  textSize(18);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Failed to load projects', width / 2, height / 2);
  textStyle(NORMAL);
}

/**
 * Draw subtle background gradient overlay
 */
function drawBackgroundGradient() {
  noStroke();
  // Create a subtle gradient from top-left to bottom-right with improved contrast
  for (let i = 0; i < width; i++) {
    let gradientColor = lerpColor(
      color(10, 20, 55, 0),
      color(0, 50, 100, 20),  // Slightly more visible
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
 * Build button positions based on project count and canvas size (grid layout)
 */
function buildButtons() {
  const btnWidth = 260;
  const btnHeight = 72;
  const btnGap = 32;
  const containerPadding = 40;

  // Determine grid columns based on canvas width
  const cols = width > 600 ? 2 : 1;
  const rows = Math.ceil(AppState.projects.length / cols);

  // Calculate total grid dimensions
  const gridWidth = cols * btnWidth + (cols - 1) * btnGap;
  const gridHeight = rows * btnHeight + (rows - 1) * btnGap;

  // Position grid in center of canvas
  const gridStartX = (width - gridWidth) / 2;
  const gridStartY = (height - gridHeight) / 2;

  // Map projects to grid positions
  AppState.buttons = AppState.projects.map((project, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = gridStartX + col * (btnWidth + btnGap);
    const y = gridStartY + row * (btnHeight + btnGap);

    return {
      ...project,
      x,
      y,
      width: btnWidth,
      height: btnHeight,
    };
  });
}

/**
 * Draw subtle grid background texture
 */
function drawGrid() {
  stroke(0, 191, 255, 8);  // Cyan grid with low opacity - improved visibility
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
  // Title text - enhanced contrast
  noStroke();
  fill(232, 240, 255, 200);  // Brighter light blue
  textSize(13);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(UIConfig.title.text, width / 2, UIConfig.title.offsetY);
  textStyle(NORMAL);

  // Decorative line with improved visibility
  stroke(0, 191, 255, 80);  // Cyan - higher opacity
  strokeWeight(1.5);
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
  const cornerRadius = 10;

  // Glow effect on hover
  if (isHovered) {
    drawButtonGlow(btn, r, g, b, cornerRadius);
  }

  // Button shadow (always present)
  drawButtonShadow(btn, cornerRadius, isHovered);

  // Button background - improved contrast
  noStroke();
  const bgColor = isHovered 
    ? color(r * 0.12, g * 0.12, b * 0.12, 220)
    : color(15, 22, 60, 160);
  fill(bgColor);
  rect(btn.x, btn.y, btn.width, btn.height, cornerRadius);

  // Button border - improved contrast
  strokeWeight(isHovered ? 2 : 1.5);
  stroke(r, g, b, isHovered ? 220 : 120);
  noFill();
  rect(btn.x, btn.y, btn.width, btn.height, cornerRadius);

  // Accent stripe with improved visibility
  drawAccentStripe(btn, r, g, b, isHovered);

  // Button label
  drawButtonLabel(btn, r, g, b, isHovered);

  // Arrow indicator
  drawArrowIndicator(btn, r, g, b, isHovered);
}

/**
 * Draw button shadow for depth
 */
function drawButtonShadow(btn, cornerRadius, isHovered) {
  noStroke();
  const shadowAlpha = isHovered ? 25 : 15;
  fill(0, 0, 0, shadowAlpha);
  rect(
    btn.x + 3,
    btn.y + 3,
    btn.width,
    btn.height,
    cornerRadius
  );
}

/**
 * Draw glow effect around button on hover
 */
function drawButtonGlow(btn, r, g, b, cornerRadius) {
  noStroke();
  
  // Create multi-layer glow for enhanced contrast
  const glowLayers = [
    { spread: 40, alpha: 6 },
    { spread: 24, alpha: 12 },
    { spread: 12, alpha: 18 },
  ];
  
  glowLayers.forEach(layer => {
    fill(r, g, b, layer.alpha);
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
  const stripeAlpha = isHovered ? 255 : 180;
  const stripeWidth = 4;
  const stripeMargin = 15;
  
  // Gradient effect on stripe
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
  const labelColor = isHovered ? color(r, g, b, 255) : color(200, 220, 240);
  fill(labelColor);
  textSize(isHovered ? 15 : 14);
  textAlign(LEFT, CENTER);
  textStyle(isHovered ? BOLD : NORMAL);
  text(btn.label, btn.x + 24, btn.y + btn.height / 2);
  textStyle(NORMAL);
}

/**
 * Draw arrow indicator on button
 */
function drawArrowIndicator(btn, r, g, b, isHovered) {
  const arrowAlpha = isHovered ? 240 : 140;
  fill(r, g, b, arrowAlpha);
  textSize(isHovered ? 16 : 14);
  textAlign(RIGHT, CENTER);
  text('↗', btn.x + btn.width - 20, btn.y + btn.height / 2);
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
