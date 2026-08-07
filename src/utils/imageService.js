const palettePresets = {
  english: ['#0B1020', '#1D4ED8', '#7C3AED', '#111827'],
  hindi: ['#111827', '#F97316', '#EC4899', '#7C2D12'],
  telugu: ['#08111F', '#14B8A6', '#F59E0B', '#2563EB'],
  instrumental: ['#07111D', '#0EA5E9', '#A855F7', '#334155'],
  radio: ['#050816', '#F43F5E', '#8B5CF6', '#10B981'],
  default: ['#0B1020', '#7C5CFC', '#A970FF', '#111827'],
};

const categoryLabels = {
  english: 'Original Album',
  hindi: 'Bollywood Album',
  telugu: 'Telugu Film Album',
  instrumental: 'Abstract Session',
  radio: 'Live Station',
  default: 'Premium Cover',
};

const safeText = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const createHash = (input = '') => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickPreset = (language = '') => palettePresets[language] || palettePresets.default;

const extractInitials = (title = '') => {
  const words = String(title).trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (!words.length) return 'GM';
  return words
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const buildSvgCover = ({ title, artist, language, kind = 'song', seed = '' }) => {
  const palette = pickPreset(kind === 'radio' ? 'radio' : language);
  const hash = createHash(`${kind}|${language}|${seed}|${title}|${artist}`);
  const rotation = hash % 360;
  const accentShift = (hash % 30) + 10;
  const initials = extractInitials(title);
  const categoryLabel = categoryLabels[kind === 'radio' ? 'radio' : language] || categoryLabels.default;
  const titleText = safeText(title || 'Untitled');
  const artistText = safeText(artist || 'Gramophone');
  const paletteText = safeText(categoryLabel);
  const rings = Array.from({ length: 5 }, (_, index) => {
    const x = 18 + ((hash >> index) % 45);
    const y = 18 + ((hash >> (index + 3)) % 45);
    const size = 58 + index * 11;
    const opacity = 0.08 + index * 0.04;
    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="none" stroke="rgba(255,255,255,${opacity.toFixed(2)})" stroke-width="1.5" />`;
  }).join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="${titleText} by ${artistText}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette[0]}" />
          <stop offset="45%" stop-color="${palette[1]}" />
          <stop offset="100%" stop-color="${palette[2]}" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.26)" />
          <stop offset="55%" stop-color="rgba(255,255,255,0.08)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="rgba(0,0,0,0.38)" />
        </filter>
        <linearGradient id="badge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.06)" />
        </linearGradient>
      </defs>

      <rect width="1200" height="1200" fill="url(#bg)" />
      <rect width="1200" height="1200" fill="url(#glow)" />

      <g opacity="0.95">
        <circle cx="180" cy="180" r="140" fill="rgba(255,255,255,0.08)" />
        <circle cx="1040" cy="220" r="200" fill="rgba(255,255,255,0.05)" />
        <circle cx="970" cy="980" r="180" fill="rgba(0,0,0,0.12)" />
        <path d="M140 860C280 700 400 640 540 650C690 660 800 780 980 720" stroke="rgba(255,255,255,0.12)" stroke-width="14" fill="none" stroke-linecap="round" />
        <path d="M90 310C230 250 390 250 510 320C640 395 760 390 940 280" stroke="rgba(255,255,255,0.1)" stroke-width="10" fill="none" stroke-linecap="round" />
      </g>

      <g filter="url(#shadow)">
        <rect x="90" y="90" width="1020" height="1020" rx="96" fill="rgba(10,14,24,0.22)" stroke="rgba(255,255,255,0.14)" />
        <rect x="120" y="120" width="960" height="960" rx="80" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" />
      </g>

      <g transform="translate(600 530) rotate(${rotation}) translate(-600 -530)">
        <circle cx="600" cy="530" r="250" fill="rgba(255,255,255,0.05)" />
        <circle cx="600" cy="530" r="188" fill="rgba(255,255,255,0.08)" />
        <circle cx="600" cy="530" r="126" fill="rgba(0,0,0,0.18)" />
        <path d="M600 300L684 470L869 485L720 603L766 785L600 692L434 785L480 603L331 485L516 470Z" fill="rgba(255,255,255,0.12)" />
      </g>

      <g opacity="0.9">
        <rect x="170" y="170" width="220" height="72" rx="36" fill="url(#badge)" stroke="rgba(255,255,255,0.15)" />
        <text x="280" y="218" text-anchor="middle" font-family="Inter, SF Pro Display, sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">${paletteText}</text>
      </g>

      <g filter="url(#shadow)">
        <rect x="280" y="810" width="640" height="170" rx="46" fill="rgba(8,11,20,0.38)" stroke="rgba(255,255,255,0.12)" />
      </g>

      <text x="600" y="875" text-anchor="middle" font-family="Inter, SF Pro Display, sans-serif" font-size="82" font-weight="800" letter-spacing="4" fill="#FFFFFF">${initials}</text>
      <text x="600" y="928" text-anchor="middle" font-family="Inter, SF Pro Display, sans-serif" font-size="30" font-weight="600" fill="rgba(255,255,255,0.84)">${titleText}</text>
      <text x="600" y="970" text-anchor="middle" font-family="Inter, SF Pro Display, sans-serif" font-size="22" font-weight="500" fill="rgba(255,255,255,0.68)">${artistText}</text>

      <g opacity="0.34">${rings}</g>

      <rect x="130" y="130" width="940" height="940" rx="78" fill="none" stroke="rgba(255,255,255,${(0.05 + accentShift / 500).toFixed(2)})" stroke-width="2" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getTrackArtwork = ({ title, artist, language, kind = 'song', seed = '', albumArt }) =>
  albumArt || buildSvgCover({ title, artist, language, kind, seed });

const replaceResolution = (url = '', size = '600x600') => {
  try {
    // common patterns: 100x100bb, 100x100, 60x60bb, etc.
    return url.replace(/(\d+x\d+)(bb)?/i, `${size}$2`);
  } catch (e) {
    return url;
  }
};

export const getBestArtwork = (songOrItem = {}) => {
  if (!songOrItem) return null;
  // preserve original fields if present
  const raw = songOrItem._raw || songOrItem;

  const candidates = [];
  if (raw.artworkUrl100) candidates.push(raw.artworkUrl100);
  if (raw.artworkUrl60) candidates.push(raw.artworkUrl60);
  if (raw.artworkUrl30) candidates.push(raw.artworkUrl30);
  // Some APIs return slightly different field names
  if (raw.artworkUrl) candidates.push(raw.artworkUrl);
  if (songOrItem.albumArt && typeof songOrItem.albumArt === 'string') candidates.push(songOrItem.albumArt);

  for (const c of candidates) {
    if (!c) continue;
    // upgrade to larger size
    const upgraded = replaceResolution(c, '1000x1000');
    // prefer 1000px, but fall back to 600px if pattern not matched
    if (upgraded && upgraded !== c) return upgraded;
    const mid = replaceResolution(c, '600x600');
    if (mid && mid !== c) return mid;
    return c;
  }

  return null;
};

export const getAlbumArt = (seed = '') =>
  buildSvgCover({ title: seed, artist: 'Gramophone', language: 'default', seed });

export const getArtistPortrait = (seed = '') =>
  buildSvgCover({ title: seed, artist: 'Artist Portrait', language: 'default', seed, kind: 'artist' });

export const getEditorialImage = (seed = '') =>
  buildSvgCover({ title: seed, artist: 'Editorial Selection', language: 'default', seed, kind: 'editorial' });

export const getLiveStationArtwork = (title = 'Live Station', artist = 'Gramophone Radio', seed = '') =>
  buildSvgCover({ title, artist, language: 'radio', kind: 'radio', seed });

export default {
  getAlbumArt,
  getArtistPortrait,
  getEditorialImage,
  getTrackArtwork,
  getLiveStationArtwork,
};
