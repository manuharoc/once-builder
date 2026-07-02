// jersey.js - sin import/export

const PATTERNS = ['none', 'stripes-v', 'stripes-h', 'halves', 'checker'];

function renderJerseyDesigner(container, initialConfig, onChange) {
  const config = {
    primary:   initialConfig && initialConfig.primary   ? initialConfig.primary   : '#10b981',
    secondary: initialConfig && initialConfig.secondary ? initialConfig.secondary : '#ffffff',
    pattern:   initialConfig && initialConfig.pattern   ? initialConfig.pattern   : 'none',
  };

  container.innerHTML = `
    <div class="jersey-editor">
      <div class="jersey-preview" style="text-align:center; margin:10px 0;"></div>
      <div class="jersey-controls">
        <label>Color principal
          <input type="color" id="jc-primary" value="${config.primary}">
        </label>
        <label>Color secundario
          <input type="color" id="jc-secondary" value="${config.secondary}">
        </label>
        <label>Patrón
          <select id="jc-pattern" class="modern-input" style="width:auto;padding:0.3rem;">
            ${PATTERNS.map(p => `<option value="${p}"${p === config.pattern ? ' selected' : ''}>${p}</option>`).join('')}
          </select>
        </label>
      </div>
    </div>
  `;

  const preview = container.querySelector('.jersey-preview');

  function draw() {
    preview.innerHTML = jerseySVG(Object.assign({}, config, { number: '10' }));
    if (onChange) onChange(Object.assign({}, config));
  }

  container.querySelector('#jc-primary').addEventListener('input', function(e)  { config.primary   = e.target.value; draw(); });
  container.querySelector('#jc-secondary').addEventListener('input', function(e) { config.secondary = e.target.value; draw(); });
  container.querySelector('#jc-pattern').addEventListener('change', function(e)  { config.pattern   = e.target.value; draw(); });

  draw();
  return config;
}

function jerseySVG(opts) {
  const primary   = opts.primary   || '#10b981';
  const secondary = opts.secondary || '#ffffff';
  const pattern   = opts.pattern   || 'none';
  const number    = opts.number    != null ? opts.number : '';

  let patternContent = '';
  if (pattern === 'stripes-v') {
    patternContent = `<rect x="25" y="0" width="15" height="100" fill="${secondary}"/>
      <rect x="60" y="0" width="15" height="100" fill="${secondary}"/>`;
  } else if (pattern === 'stripes-h') {
    patternContent = `<rect x="0" y="25" width="100" height="15" fill="${secondary}"/>
      <rect x="0" y="60" width="100" height="15" fill="${secondary}"/>`;
  } else if (pattern === 'halves') {
    patternContent = `<rect x="50" y="0" width="50" height="100" fill="${secondary}"/>`;
  } else if (pattern === 'checker') {
    patternContent = `<rect x="50" y="0" width="50" height="50" fill="${secondary}"/>
      <rect x="0" y="50" width="50" height="50" fill="${secondary}"/>`;
  }

  const textBg    = pattern !== 'none' ? `<circle cx="50" cy="50" r="22" fill="rgba(255,255,255,0.85)"/>` : '';
  const textColor = pattern !== 'none' ? '#000' : (secondary === primary ? '#000' : secondary);

  return `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="circleClip">
        <circle cx="50" cy="50" r="48"/>
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="48" fill="${primary}" stroke="#ffffff" stroke-width="3"/>
    <g clip-path="url(#circleClip)">${patternContent}</g>
    ${textBg}
    <text x="50" y="62" font-family="Outfit,sans-serif" font-size="34" font-weight="800" text-anchor="middle" fill="${textColor}">${number}</text>
  </svg>`;
}
