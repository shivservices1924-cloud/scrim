import fs from 'fs';
import path from 'path';

const logoBase64 = fs.readFileSync('public/app-logo.png').toString('base64');
const logoUri = `data:image/jpeg;base64,${logoBase64}`;

function createPosterSVG({
  categoryTitle,
  categorySub,
  subtitle,
  prizeText,
  rules,
  mapText,
  playersText,
  modeText,
  badgeTitle,
  primaryColor = '#a855f7',
  secondaryColor = '#d946ef',
  accentColor = '#eab308'
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 809" width="1024" height="809">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06010d" />
      <stop offset="40%" stop-color="#140628" />
      <stop offset="75%" stop-color="#240742" />
      <stop offset="100%" stop-color="#090214" />
    </linearGradient>

    <linearGradient id="purpleFlame" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#d946ef" stop-opacity="0.7" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>

    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <linearGradient id="hudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e0b38" stop-opacity="0.92" />
      <stop offset="100%" stop-color="#0d031c" stop-opacity="0.96" />
    </linearGradient>

    <!-- Glowing Filters -->
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.9" />
    </filter>

    <clipPath id="charClip">
      <circle cx="280" cy="380" r="270" />
    </clipPath>
  </defs>

  <style>
    .ff-font { font-family: 'Rajdhani', 'Impact', 'Arial Black', sans-serif; font-weight: 900; }
    .ff-body { font-family: 'Inter', system-ui, sans-serif; font-weight: 700; }
  </style>

  <!-- Deep Cyber Dark Background -->
  <rect width="1024" height="809" fill="url(#bgGrad)" />

  <!-- Background Swirling Nebula & Energy Rays -->
  <circle cx="280" cy="380" r="340" fill="#9333ea" opacity="0.32" filter="url(#neonGlow)" />
  <circle cx="280" cy="380" r="220" fill="#c084fc" opacity="0.22" filter="url(#neonGlow)" />
  <circle cx="750" cy="400" r="280" fill="#581c87" opacity="0.25" filter="url(#neonGlow)" />

  <!-- Diagonal Cyber Hexagon Grid Pattern Lines -->
  <g stroke="#a855f7" stroke-width="1" opacity="0.12">
    <line x1="0" y1="120" x2="1024" y2="120" />
    <line x1="0" y1="260" x2="1024" y2="260" />
    <line x1="0" y1="400" x2="1024" y2="400" />
    <line x1="0" y1="540" x2="1024" y2="540" />
    <line x1="0" y1="680" x2="1024" y2="680" />
    <line x1="150" y1="0" x2="150" y2="809" />
    <line x1="350" y1="0" x2="350" y2="809" />
    <line x1="550" y1="0" x2="550" y2="809" />
    <line x1="750" y1="0" x2="750" y2="809" />
    <line x1="950" y1="0" x2="950" y2="809" />
  </g>

  <!-- Left: Stylized Anime Character in Purple Aura -->
  <g transform="translate(10, 40)">
    <!-- Aura Ring -->
    <circle cx="310" cy="350" r="260" fill="none" stroke="url(#purpleFlame)" stroke-width="8" opacity="0.85" filter="url(#neonGlow)" />
    <circle cx="310" cy="350" r="248" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="14,10" opacity="0.75" />
    
    <!-- Character Artwork (High-Res from User Logo) -->
    <g clip-path="url(#charClip)" transform="translate(30, -30)">
      <image href="${logoUri}" x="0" y="70" width="560" height="560" preserveAspectRatio="xMidYMid slice" />
    </g>
    
    <!-- Additional Purple Flame Overlays -->
    <path d="M 120 540 Q 220 380 320 540 T 520 540" fill="none" stroke="#d946ef" stroke-width="6" opacity="0.4" filter="url(#neonGlow)" />
  </g>

  <!-- Top Header Bar -->
  <!-- Top-Left: RushX Brand Logo -->
  <g transform="translate(40, 30)">
    <!-- Crown -->
    <path d="M 20 22 L 28 8 L 36 22 L 44 8 L 52 22 L 48 30 L 24 30 Z" fill="url(#goldGrad)" filter="url(#softGlow)" />
    <circle cx="28" cy="7" r="2" fill="#fff" />
    <circle cx="36" cy="20" r="2" fill="#fff" />
    <circle cx="44" cy="7" r="2" fill="#fff" />
    <text x="70" y="32" class="ff-font" font-size="44" fill="#ffffff" letter-spacing="1">
      Rush<tspan fill="#a855f7">X</tspan>
    </text>
    <text x="72" y="48" class="ff-body" font-size="11" fill="#cbd5e1" letter-spacing="3">
      PLAY • COMPETE • WIN
    </text>
  </g>

  <!-- Top-Right: FREE FIRE Logo -->
  <g transform="translate(820, 32)">
    <rect x="-10" y="0" width="170" height="42" rx="8" fill="#000" opacity="0.5" />
    <text x="75" y="30" text-anchor="middle" class="ff-font" font-size="28" font-style="italic" fill="#ffffff" letter-spacing="3" filter="url(#softGlow)">
      FREE FIRE
    </text>
  </g>

  <!-- Right Side: Cyberpunk HUD Rules Box -->
  <g transform="translate(620, 110)">
    <!-- Outer Glow Polygon Box -->
    <rect x="0" y="0" width="365" height="505" rx="30" fill="url(#hudGrad)" stroke="#a855f7" stroke-width="4" filter="url(#dropShadow)" />
    <rect x="6" y="6" width="353" height="493" rx="25" fill="none" stroke="#d946ef" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.6" />
    
    <!-- Neon Corner Accents -->
    <path d="M 0 50 L 0 0 L 50 0" fill="none" stroke="#facc15" stroke-width="5" />
    <path d="M 315 0 L 365 0 L 365 50" fill="none" stroke="#facc15" stroke-width="5" />
    <path d="M 365 455 L 365 505 L 315 505" fill="none" stroke="#facc15" stroke-width="5" />
    <path d="M 50 505 L 0 505 L 0 455" fill="none" stroke="#facc15" stroke-width="5" />

    <!-- RULES Title with Crosshair Icon -->
    <g transform="translate(30, 48)">
      <circle cx="15" cy="0" r="14" fill="none" stroke="#d946ef" stroke-width="3" />
      <circle cx="15" cy="0" r="6" fill="#d946ef" />
      <line x1="15" y1="-18" x2="15" y2="18" stroke="#d946ef" stroke-width="2" />
      <line x1="-3" y1="0" x2="33" y2="0" stroke="#d946ef" stroke-width="2" />
      <text x="45" y="10" class="ff-font" font-size="36" fill="#ffffff" font-style="italic" letter-spacing="2">
        RULES
      </text>
    </g>

    <!-- Rule 1 -->
    <g transform="translate(30, 115)">
      <circle cx="20" cy="15" r="20" fill="#3f0f18" stroke="#ef4444" stroke-width="3" />
      <line x1="6" y1="2" x2="34" y2="28" stroke="#ef4444" stroke-width="3" />
      <!-- Small icon inside -->
      <circle cx="20" cy="15" r="7" fill="#f87171" opacity="0.8" />
      <text x="56" y="14" class="ff-body" font-size="16" fill="#ffffff">
        ${rules[0]?.title || 'No Emulator / Hacks'}
      </text>
      <text x="56" y="32" class="ff-body" font-size="12" fill="#94a3b8">
        ${rules[0]?.desc || '(Instant Permanent Ban)'}
      </text>
    </g>

    <!-- Rule 2 -->
    <g transform="translate(30, 190)">
      <circle cx="20" cy="15" r="20" fill="#3f0f18" stroke="#ef4444" stroke-width="3" />
      <line x1="6" y1="2" x2="34" y2="28" stroke="#ef4444" stroke-width="3" />
      <!-- Small icon inside -->
      <path d="M 15 12 L 20 8 L 25 12 L 20 20 Z" fill="#f87171" />
      <text x="56" y="14" class="ff-body" font-size="16" fill="#ffffff">
        ${rules[1]?.title || 'Fair Play Guaranteed'}
      </text>
      <text x="56" y="32" class="ff-body" font-size="12" fill="#94a3b8">
        ${rules[1]?.desc || '(Official Room Settings)'}
      </text>
    </g>

    <!-- Rule 3 -->
    <g transform="translate(30, 265)">
      <circle cx="20" cy="15" r="20" fill="#3f0f18" stroke="#ef4444" stroke-width="3" />
      <line x1="6" y1="2" x2="34" y2="28" stroke="#ef4444" stroke-width="3" />
      <!-- Small icon inside -->
      <circle cx="16" cy="12" r="3" fill="#f87171" />
      <circle cx="24" cy="12" r="3" fill="#f87171" />
      <text x="56" y="14" class="ff-body" font-size="16" fill="#ffffff">
        ${rules[2]?.title || 'Play With Team Only'}
      </text>
      <text x="56" y="32" class="ff-body" font-size="12" fill="#94a3b8">
        ${rules[2]?.desc || '(Strict Enforcement)'}
      </text>
    </g>

    <!-- Divider Dotted Line -->
    <line x1="30" y1="330" x2="335" y2="330" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6" />

    <!-- Info Grid: MAP, PLAYERS, MODE -->
    <!-- MAP -->
    <g transform="translate(30, 365)">
      <circle cx="12" cy="0" r="10" fill="#581c87" />
      <text x="12" y="4" text-anchor="middle" class="ff-body" font-size="12" fill="#c084fc">📍</text>
      <text x="35" y="-5" class="ff-body" font-size="12" fill="#c084fc">MAP</text>
      <text x="35" y="15" class="ff-font" font-size="20" fill="#ffffff">${mapText}</text>
    </g>

    <!-- PLAYERS -->
    <g transform="translate(30, 415)">
      <circle cx="12" cy="0" r="10" fill="#581c87" />
      <text x="12" y="4" text-anchor="middle" class="ff-body" font-size="12" fill="#c084fc">👥</text>
      <text x="35" y="-5" class="ff-body" font-size="12" fill="#c084fc">PLAYERS</text>
      <text x="35" y="15" class="ff-font" font-size="20" fill="#ffffff">${playersText}</text>
    </g>

    <!-- MODE -->
    <g transform="translate(30, 465)">
      <circle cx="12" cy="0" r="10" fill="#581c87" />
      <text x="12" y="4" text-anchor="middle" class="ff-body" font-size="12" fill="#c084fc">🏆</text>
      <text x="35" y="-5" class="ff-body" font-size="12" fill="#c084fc">MODE</text>
      <text x="35" y="15" class="ff-font" font-size="20" fill="#ffffff">${modeText}</text>
    </g>
  </g>

  <!-- Big Title Area (Bottom Left & Center) -->
  <g transform="translate(40, 520)">
    <!-- Crown on Top of Title -->
    <g transform="translate(140, -10)">
      <path d="M 0 25 L 12 5 L 24 20 L 36 5 L 48 25 Z" fill="url(#goldGrad)" filter="url(#softGlow)" />
      <circle cx="12" cy="4" r="2.5" fill="#ffffff" />
      <circle cx="24" cy="18" r="2" fill="#ffffff" />
      <circle cx="36" cy="4" r="2.5" fill="#ffffff" />
    </g>

    <!-- Primary Title line 1: e.g. "BR" or "CS" or "LONE" -->
    <text x="0" y="80" class="ff-font" font-size="105" font-style="italic" fill="url(#silverGrad)" stroke="#0f0321" stroke-width="12" paint-order="stroke fill" filter="url(#dropShadow)">
      ${categoryTitle}
    </text>

    <!-- Primary Title line 2: e.g. "DUO" or "HEADSHOT" or "WOLF" -->
    <text x="210" y="80" class="ff-font" font-size="105" font-style="italic" fill="#ffffff" stroke="#9333ea" stroke-width="14" paint-order="stroke fill" filter="url(#neonGlow)">
      ${categorySub}
    </text>

    <!-- Purple Brush Stroke Banner: "TOURNAMENT" -->
    <g transform="translate(0, 105)">
      <path d="M -10 -25 L 490 -30 L 460 25 L -40 30 Z" fill="#7e22ce" filter="url(#neonGlow)" />
      <path d="M 0 -20 L 470 -25 L 445 20 L -25 25 Z" fill="#9333ea" />
      <text x="220" y="8" text-anchor="middle" class="ff-font" font-size="44" font-style="italic" fill="#ffffff" letter-spacing="5" filter="url(#dropShadow)">
        TOURNAMENT
      </text>
    </g>

    <!-- Subtitle -->
    <text x="12" y="165" class="ff-font" font-size="28" font-style="italic" fill="#facc15" letter-spacing="2" filter="url(#softGlow)">
      ${subtitle}
    </text>
  </g>

  <!-- Prize Pill (Bottom Right) -->
  <g transform="translate(600, 635)">
    <!-- Glowing Rounded Pill Container -->
    <rect x="0" y="0" width="385" height="75" rx="24" fill="#1e0b38" stroke="#a855f7" stroke-width="3" filter="url(#neonGlow)" />
    <rect x="3" y="3" width="379" height="69" rx="21" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="10,6" opacity="0.8" />
    
    <!-- Trophy Icon -->
    <g transform="translate(25, 18)">
      <path d="M 6 4 L 32 4 L 28 22 Q 26 32 19 35 Q 12 32 10 22 Z" fill="url(#goldGrad)" filter="url(#softGlow)" />
      <path d="M 19 35 L 19 44 M 10 44 L 28 44" stroke="url(#goldGrad)" stroke-width="4" stroke-linecap="round" />
      <path d="M 6 8 Q -3 10 2 20 Q 7 24 10 20" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
      <path d="M 32 8 Q 41 10 36 20 Q 31 24 28 20" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
    </g>

    <!-- Prize Text -->
    <text x="85" y="50" class="ff-font" font-size="40" font-style="italic" fill="#fde047" letter-spacing="2" filter="url(#dropShadow)">
      ${prizeText}
    </text>
  </g>

  <!-- Bottom Bar: Social / Join Now / #RushX -->
  <g transform="translate(40, 780)">
    <!-- Instagram & YouTube -->
    <g transform="translate(0, 0)">
      <rect x="-5" y="-18" width="22" height="22" rx="6" fill="none" stroke="#e879f9" stroke-width="2" />
      <circle cx="6" cy="-7" r="5" fill="none" stroke="#e879f9" stroke-width="2" />
      <circle cx="12" cy="-13" r="1.5" fill="#e879f9" />
      <text x="28" y="-2" class="ff-body" font-size="14" fill="#f5d0fe">
        /rushx_scrim
      </text>
    </g>

    <!-- Center Call-to-Action -->
    <g transform="translate(360, 0)">
      <path d="M 0 -8 L 6 -18 L 12 -8 L 18 -18 L 24 -8 Z" fill="url(#goldGrad)" />
      <text x="35" y="-2" class="ff-font" font-size="18" font-style="italic" fill="#ffffff" letter-spacing="1">
        JOIN NOW &amp; SHOW YOUR SKILLS
      </text>
    </g>

    <!-- Right Hashtag -->
    <text x="940" y="-2" text-anchor="end" class="ff-font" font-size="28" font-style="italic" fill="#d946ef" letter-spacing="2" filter="url(#softGlow)">
      #RushX
    </text>
  </g>
</svg>`;
}

// 1. Generate BR DUO Poster
const brDuoSvg = createPosterSVG({
  categoryTitle: 'BR',
  categorySub: 'DUO',
  subtitle: 'TEAM UP &amp; CLAIM YOUR VICTORY',
  prizeText: 'WIN ₹160-₹720',
  rules: [
    { title: 'No Vehicle In Final Zone', desc: '(Only Foot Movement Allowed)' },
    { title: 'Play With Registered Duo', desc: '(Teammate UID Must Match)' },
    { title: 'Strict Fair Play Policy', desc: '(No Third-Party Scripts/Emus)' }
  ],
  mapText: 'Bermuda',
  playersText: '2 (Duo)',
  modeText: 'Duo',
  badgeTitle: 'DUO TOURNAMENT'
});

// 2. Generate CS HEADSHOT Poster
const csSvg = createPosterSVG({
  categoryTitle: 'CS',
  categorySub: 'HEADSHOT',
  subtitle: 'ONLY HEADSHOTS COUNT • AIM HIGH',
  prizeText: 'WIN ₹80-₹360',
  rules: [
    { title: 'Headshot Only Mode', desc: '(Body Shot Kills Disqualified)' },
    { title: 'No Grenades or Launchers', desc: '(Guns &amp; Desert Eagle Only)' },
    { title: 'Strict CS Bermuda Map', desc: '(Custom Room Competitive)' }
  ],
  mapText: 'Bermuda CS',
  playersText: '1V1 / 4V4',
  modeText: 'Clash Squad',
  badgeTitle: 'CS HEADSHOT'
});

// 3. Generate LONE WOLF Poster
const loneWolfSvg = createPosterSVG({
  categoryTitle: 'LONE',
  categorySub: 'WOLF',
  subtitle: '1V1 IRON CAGE • PROVE YOUR DOMINANCE',
  prizeText: 'WIN ₹80-₹360',
  rules: [
    { title: '1V1 Pure Solo Duel', desc: '(Zero Outside Interference)' },
    { title: 'Round Win Scoring', desc: '(First to 5 Rounds Claims Victory)' },
    { title: 'No Passive Camping', desc: '(Face Your Opponent Like a Wolf)' }
  ],
  mapText: 'Iron Cage',
  playersText: '1 (Solo)',
  modeText: 'Lone Wolf',
  badgeTitle: 'LONE WOLF 1V1'
});

fs.writeFileSync('public/poster-br-duo.svg', brDuoSvg);
fs.writeFileSync('public/poster-cs.svg', csSvg);
fs.writeFileSync('public/poster-lone-wolf.svg', loneWolfSvg);

console.log('✅ Generated public/poster-br-duo.svg');
console.log('✅ Generated public/poster-cs.svg');
console.log('✅ Generated public/poster-lone-wolf.svg');

