// Diseñador simple de camiseta en SVG: color principal, secundario, patrón y número.

const PATTERNS = ['none', 'stripes-v', 'stripes-h', 'sleeves-diff'];

export function renderJerseyDesigner(container, initialConfig, onChange) {
  const config = {
    primary: initialConfig?.primary ?? '#e63946',
    secondary: initialConfig?.secondary ?? '#ffffff',
    pattern: initialConfig?.pattern ?? 'none',
    number: initialConfig?.number ?? '10'
  };

  container.innerHTML = `
    <div class="jersey-editor">
      <div class="jersey-preview"></div>
      <div class="jersey-controls">
        <label>Color principal
          <input type="color" id="jc-primary" value="${config.primary}">
        </label>
        <label>Color secundario
          <input type="color" id="jc-secondary" value="${config.secondary}">
        </label>
        <label>Patrón
          <select id="jc-pattern">
            ${PATTERNS.map(p => `<option value="${p}" ${p === config.pattern ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </label>
        <label>Número
          <input type="text" id="jc-number" maxlength="2" value="${config.number}">
        </label>
      </div>
    </div>
  `;

  const preview = container.querySelector('.jersey-preview');

  function draw() {
    preview.innerHTML = jerseySVG(config);
    onChange?.(config);
  }

  container.querySelector('#jc-primary').addEventListener('input', e => { config.primary = e.target.value; draw(); });
  container.querySelector('#jc-secondary').addEventListener('input', e => { config.secondary = e.target.value; draw(); });
  container.querySelector('#jc-pattern').addEventListener('change', e => { config.pattern = e.target.value; draw(); });
  container.querySelector('#jc-number').addEventListener('input', e => { config.number = e.target.value; draw(); });

  draw();
  return config;
}

export function jerseySVG({ primary, secondary, pattern, number }) {
  const stripes = pattern === 'stripes-v'
    ? `<rect x="60" y="20" width="15" height="120" fill="${secondary}"/><rect x="90" y="20" width="15" height="120" fill="${secondary}"/><rect x="120" y="20" width="15" height="120" fill="${secondary}"/>`
    : pattern === 'stripes-h'
    ? `<rect x="30" y="50" width="140" height="15" fill="${secondary}"/><rect x="30" y="80" width="140" height="15" fill="${secondary}"/><rect x="30" y="110" width="140" height="15" fill="${secondary}"/>`
    : '';

  const sleeves = pattern === 'sleeves-diff'
    ? `<path d="M30 20 L0 50 L15 90 L45 60 Z" fill="${secondary}"/><path d="M170 20 L200 50 L185 90 L155 60 Z" fill="${secondary}"/>`
    : `<path d="M30 20 L0 50 L15 90 L45 60 Z" fill="${primary}"/><path d="M170 20 L200 50 L185 90 L155 60 Z" fill="${primary}"/>`;

  return `
    <svg viewBox="0 0 200 180" width="160" height="150" xmlns="http://www.w3.org/2000/svg">
      <path d="M45 60 L30 20 Q100 -5 170 20 L155 60 L155 170 L45 170 Z" fill="${primary}"/>
      ${stripes}
      ${sleeves}
      <text x="100" y="120" font-size="40" font-weight="bold" text-anchor="middle" fill="${secondary === primary ? '#000' : secondary}">${number}</text>
    </svg>
  `;
}
