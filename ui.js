// ─── UI: project cards & search ──────────────────────────────────────
(function () {
  const cardsEl = document.querySelector('#projectCards');
  const searchEl = document.querySelector('#project-search');

  function buildProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card';

    const [r, g, b] = project.accent;
    card.style.setProperty('--accent-r', r);
    card.style.setProperty('--accent-g', g);
    card.style.setProperty('--accent-b', b);

    // Conteúdo do cartão
    card.innerHTML = `
      <div class="card-flower" aria-hidden="true"></div>
      <div class="card-copy">
        <h2>${project.label}</h2>
        <p>Open the live demo or explore the repository.</p>
      </div>
      <div class="card-meta">
        <a href="${project.url}" target="_blank" rel="noreferrer noopener" class="card-pill">Demo</a>
        <a href="${project.arrowUrl || project.url}" target="_blank" rel="noreferrer noopener" class="card-arrow" title="View source">↗</a>
      </div>
    `;

    return card;
  }

  function renderCards(filter = '') {
    const query = filter.trim().toLowerCase();
    cardsEl.innerHTML = '';

    const projects = getProjects();
    const filtered = projects.filter((project) =>
      project.label.toLowerCase().includes(query)
    );

    if (!filtered.length) {
      cardsEl.innerHTML = '<p class="empty-state">No projects matched your search.</p>';
      return;
    }

    filtered.forEach((project) => cardsEl.appendChild(buildProjectCard(project)));
  }

  searchEl.addEventListener('input', (event) => renderCards(event.target.value));
  renderCards();
})();