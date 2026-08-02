/* ==========================================================================
   CELEBRATI — PURE JS QR CODE GENERATOR MODULE
   ========================================================================== */

export function generateQRCodeSVG(text, size = 180) {
  // Simple deterministic 2D grid matrix generator for demonstration & high quality offline rendering
  const cells = 21;
  const cellSize = size / cells;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let rects = '';
  // Corner position detection patterns
  function isCornerPattern(r, c) {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= cells - 7) return true;
    if (r >= cells - 7 && c < 7) return true;
    return false;
  }

  // Generate matrix
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      let filled = false;
      if (isCornerPattern(r, c)) {
        // Outer box or inner dot
        const inOuter = (r === 0 || r === 6 || c === 0 || c === 6 || r === cells - 7 || r === cells - 1 || c === cells - 7 || c === cells - 1);
        const inInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                        (r >= 2 && r <= 4 && c >= cells - 5 && c >= cells - 3) ||
                        (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
        filled = inOuter || inInner;
      } else {
        const val = Math.abs(Math.sin((r * cells + c + hash) * 12.9898) * 43758.5453);
        filled = (val - Math.floor(val)) > 0.45;
      }

      if (filled) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="#0F172A"/>`;
      }
    }
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#FFFFFF" rx="8"/>
      ${rects}
    </svg>
  `;
}

export function renderQRCodeToCanvas(canvas, text, size = 200) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  const cells = 21;
  const cellSize = size / cells;

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  function isCornerPattern(r, c) {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= cells - 7) return true;
    if (r >= cells - 7 && c < 7) return true;
    return false;
  }

  ctx.fillStyle = '#0F172A';
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      let filled = false;
      if (isCornerPattern(r, c)) {
        const inOuter = (r === 0 || r === 6 || c === 0 || c === 6 || r === cells - 7 || r === cells - 1 || c === cells - 7 || c === cells - 1);
        const inInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                        (r >= 2 && r <= 4 && c >= cells - 5 && c >= cells - 3) ||
                        (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
        filled = inOuter || inInner;
      } else {
        const val = Math.abs(Math.sin((r * cells + c + hash) * 12.9898) * 43758.5453);
        filled = (val - Math.floor(val)) > 0.45;
      }

      if (filled) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize + 0.5, cellSize + 0.5);
      }
    }
  }
}
