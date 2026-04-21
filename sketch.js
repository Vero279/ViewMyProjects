const AppState = {
  buttons: [],
  hoveredIndex: -1,
  isReady: false,
};

function setup() {
  const cnv = createCanvas(min(windowWidth, 900), min(windowHeight, 600));
  cnv.parent('canvas-container');
  initApp();
  window.addEventListener('resize', () => {
    resizeCanvas(min(windowWidth, 900), min(windowHeight, 600));
    buildButtons();
  });
}

function initApp() {
  if (typeof AppConfig !== 'undefined') {
    AppState.isReady = true;
    buildButtons();
  }
}

function buildButtons() {
  const btnWidth = 200;
  const btnHeight = 60;
  const gap = 20;
  
  let tempButtons = [];
  AppConfig.projects.forEach(p => {
    // Main project button
    tempButtons.push({ label: p.label, url: p.url, accent: p.accent, type: 'main' });
    // GitHubRep button
    tempButtons.push({ label: "GitHubRep", url: p.repo, accent: p.accent, type: 'repo' });
  });

  const cols = width > 600 ? 4 : 2;
  const rows = Math.ceil(tempButtons.length / cols);
  const startX = (width - (cols * btnWidth + (cols - 1) * gap)) / 2;
  const startY = (height - (rows * btnHeight + (rows - 1) * gap)) / 2;

  AppState.buttons = tempButtons.map((b, i) => ({
    ...b,
    x: startX + (i % cols) * (btnWidth + gap),
    y: startY + Math.floor(i / cols) * (btnHeight + gap),
    w: btnWidth,
    h: btnHeight
  }));
}

function draw() {
  background(10, 14, 39);
  AppState.buttons.forEach((btn, i) => {
    const isHovered = i === AppState.hoveredIndex;
    const [r, g, b] = btn.accent;
    
    // Style logic: Repo buttons look slightly different
    stroke(r, g, b, isHovered ? 255 : 100);
    fill(isHovered ? color(r, g, b, 50) : color(0, 0, 0, 100));
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text(btn.label, btn.x + btn.w/2, btn.y + btn.h/2);
  });
}

function mouseMoved() {
  AppState.hoveredIndex = AppState.buttons.findIndex(b => 
    mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h
  );
  cursor(AppState.hoveredIndex >= 0 ? HAND : ARROW);
}

function mousePressed() {
  if (AppState.hoveredIndex >= 0) {
    window.open(AppState.buttons[AppState.hoveredIndex].url, '_blank');
  }
}
