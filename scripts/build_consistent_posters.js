import fs from 'fs';
import path from 'path';

const bgBase64 = fs.readFileSync('public/poster-br-solo.jpg').toString('base64');
const dataUri = `data:image/jpeg;base64,${bgBase64}`;

// Also provide direct JPEG fallback copies
fs.copyFileSync('public/poster-br-solo.jpg', 'public/poster-br-duo.jpg');
fs.copyFileSync('public/poster-br-solo.jpg', 'public/poster-cs.jpg');
fs.copyFileSync('public/poster-br-solo.jpg', 'public/poster-lone-wolf.jpg');

// Common social badge overlay on bottom-left
const socialBadge = `
  <!-- Bottom Left: Instagram /rushx_scrim & YouTube Live -->
  <g transform="translate(38, 736)">
    <rect x="-6" y="-6" width="235" height="46" rx="14" fill="#090214" stroke="#c084fc" stroke-width="2.5" />
    <g transform="translate(6, 6)">
      <rect x="0" y="0" width="24" height="24" rx="6" fill="none" stroke="#e879f9" stroke-width="2" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="#e879f9" stroke-width="2" />
      <circle cx="18" cy="6" r="1.5" fill="#e879f9" />
    </g>
    <g transform="translate(36, 6)">
      <rect x="0" y="0" width="28" height="24" rx="6" fill="#ef4444" />
      <polygon points="11,6 20,12 11,18" fill="#ffffff" />
    </g>
    <text x="74" y="23" fill="#fde047" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="20" letter-spacing="1">
      /rushx_scrim
    </text>
  </g>
`;

// 1. BR SOLO
const brSoloSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 809" width="1024" height="809">
  <!-- Original HD Poster Image -->
  <image href="${dataUri}" xlink:href="${dataUri}" x="0" y="0" width="1024" height="809" preserveAspectRatio="xMidYMid slice" />
  ${socialBadge}
</svg>`;

// 2. BR DUO
const brDuoSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 809" width="1024" height="809">
  <defs>
    <filter id="neonPurple" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- HD Poster Base -->
  <image href="${dataUri}" xlink:href="${dataUri}" x="0" y="0" width="1024" height="809" preserveAspectRatio="xMidYMid slice" />

  <!-- Overlay on Title to change SOLO -> DUO -->
  <g transform="translate(170, 560)">
    <rect x="0" y="-10" width="410" height="150" rx="20" fill="#070110" opacity="0.95" />
    <!-- DUO Text -->
    <text x="205" y="105" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="120" font-style="italic" fill="#c084fc" stroke="#f43f5e" stroke-width="4" filter="url(#neonPurple)" letter-spacing="4">
      DUO
    </text>
    <text x="205" y="105" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="120" font-style="italic" fill="#ffffff" letter-spacing="4">
      DUO
    </text>
  </g>

  <!-- Overlay on Rules Panel for Duo Info -->
  <g transform="translate(640, 550)">
    <rect x="-10" y="-8" width="340" height="90" rx="14" fill="#090214" stroke="#a855f7" stroke-width="2" />
    <text x="20" y="28" font-family="'Inter', sans-serif" font-weight="800" font-size="16" fill="#c084fc">MAP: <tspan fill="#ffffff">Bermuda</tspan></text>
    <text x="20" y="52" font-family="'Inter', sans-serif" font-weight="800" font-size="16" fill="#fde047">PLAYERS: <tspan fill="#fde047">2 (Duo Squad)</tspan></text>
    <text x="20" y="74" font-family="'Inter', sans-serif" font-weight="800" font-size="16" fill="#c084fc">REVIVE: <tspan fill="#4ade80">ALLOWED (Partner)</tspan></text>
  </g>

  <!-- Overlay on WIN Prize Trophy -->
  <g transform="translate(600, 652)">
    <rect x="0" y="-6" width="380" height="66" rx="18" fill="#070110" stroke="#facc15" stroke-width="3" />
    <text x="190" y="42" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="34" font-style="italic" fill="#fde047" letter-spacing="2">
      🏆 WIN ₹160-₹720
    </text>
  </g>

  ${socialBadge}
</svg>`;

// 3. CS HEADSHOT
const csHeadshotSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 809" width="1024" height="809">
  <defs>
    <filter id="neonRed" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- HD Poster Base -->
  <image href="${dataUri}" xlink:href="${dataUri}" x="0" y="0" width="1024" height="809" preserveAspectRatio="xMidYMid slice" />

  <!-- Title Overlay: CS HEADSHOT -->
  <g transform="translate(150, 470)">
    <rect x="0" y="-10" width="460" height="240" rx="20" fill="#070110" opacity="0.96" />
    <text x="230" y="80" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="80" font-style="italic" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" filter="url(#neonRed)" letter-spacing="4">
      CLASH SQUAD
    </text>
    <text x="230" y="80" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="80" font-style="italic" fill="#ffffff" letter-spacing="4">
      CLASH SQUAD
    </text>
    <text x="230" y="165" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="70" font-style="italic" fill="#facc15" stroke="#ca8a04" stroke-width="3" letter-spacing="3">
      🎯 HEADSHOT
    </text>
    <text x="230" y="210" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="20" fill="#ef4444" letter-spacing="2">
      ONLY HEADSHOT COUNT • 1V1
    </text>
  </g>

  <!-- Overlay on Rules Panel -->
  <g transform="translate(640, 200)">
    <rect x="-10" y="-8" width="340" height="430" rx="18" fill="#090214" stroke="#ef4444" stroke-width="2.5" />
    <text x="160" y="32" text-anchor="middle" font-family="'Rajdhani', sans-serif" font-weight="900" font-size="24" fill="#ef4444" letter-spacing="2">
      🎯 CS RULES
    </text>
    <line x1="10" y1="46" x2="310" y2="46" stroke="#ef4444" stroke-width="1.5" opacity="0.5" />
    <text x="15" y="80" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fca5a5">❌ No Body Shot</text>
    <text x="35" y="102" font-family="'Inter', sans-serif" font-size="12" fill="#cbd5e1">(Headshot Only Payout)</text>
    <text x="15" y="135" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fca5a5">🔫 Allowed Guns:</text>
    <text x="35" y="157" font-family="'Inter', sans-serif" font-size="12" fill="#cbd5e1">Desert Eagle, M1887, Woodpecker</text>
    <text x="15" y="190" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fca5a5">🛡️ Gloo Wall: Unlimited</text>
    <text x="15" y="225" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fca5a5">🚫 No Grenades / Launcher</text>
    <line x1="10" y1="245" x2="310" y2="245" stroke="#ef4444" stroke-width="1.5" opacity="0.5" />
    <text x="15" y="280" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">MAP: <tspan fill="#ffffff">Bermuda CS</tspan></text>
    <text x="15" y="310" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">ROUNDS: <tspan fill="#ffffff">7 Rounds (Custom)</tspan></text>
    <text x="15" y="340" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fde047">MODE: <tspan fill="#fde047">Clash Squad 1v1</tspan></text>
    <text x="15" y="370" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">RECORDING: <tspan fill="#4ade80">Mandatory</tspan></text>
  </g>

  <!-- Overlay on WIN Trophy -->
  <g transform="translate(600, 652)">
    <rect x="0" y="-6" width="380" height="66" rx="18" fill="#070110" stroke="#facc15" stroke-width="3" />
    <text x="190" y="42" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="34" font-style="italic" fill="#fde047" letter-spacing="2">
      🏆 WIN ₹80-₹360
    </text>
  </g>

  ${socialBadge}
</svg>`;

// 4. LONE WOLF 1V1
const loneWolfSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 809" width="1024" height="809">
  <defs>
    <filter id="neonGold" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- HD Poster Base -->
  <image href="${dataUri}" xlink:href="${dataUri}" x="0" y="0" width="1024" height="809" preserveAspectRatio="xMidYMid slice" />

  <!-- Title Overlay: LONE WOLF 1V1 -->
  <g transform="translate(150, 480)">
    <rect x="0" y="-10" width="460" height="230" rx="20" fill="#070110" opacity="0.96" />
    <text x="230" y="80" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="80" font-style="italic" fill="#facc15" stroke="#854d0e" stroke-width="3" filter="url(#neonGold)" letter-spacing="4">
      LONE WOLF
    </text>
    <text x="230" y="80" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="80" font-style="italic" fill="#ffffff" letter-spacing="4">
      LONE WOLF
    </text>
    <text x="230" y="165" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="70" font-style="italic" fill="#c084fc" stroke="#6b21a8" stroke-width="3" letter-spacing="3">
      🐺 1V1 DUEL
    </text>
    <text x="230" y="205" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="20" fill="#facc15" letter-spacing="2">
      IRON CAGE SHOWDOWN
    </text>
  </g>

  <!-- Overlay on Rules Panel -->
  <g transform="translate(640, 200)">
    <rect x="-10" y="-8" width="340" height="430" rx="18" fill="#090214" stroke="#facc15" stroke-width="2.5" />
    <text x="160" y="32" text-anchor="middle" font-family="'Rajdhani', sans-serif" font-weight="900" font-size="24" fill="#facc15" letter-spacing="2">
      🐺 LW RULES
    </text>
    <line x1="10" y1="46" x2="310" y2="46" stroke="#facc15" stroke-width="1.5" opacity="0.5" />
    <text x="15" y="80" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fef08a">⚔️ Pure 1v1 Combat</text>
    <text x="35" y="102" font-family="'Inter', sans-serif" font-size="12" fill="#cbd5e1">(Best of 9 Rounds)</text>
    <text x="15" y="135" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fef08a">🔫 Chosen Weapons Only</text>
    <text x="35" y="157" font-family="'Inter', sans-serif" font-size="12" fill="#cbd5e1">(No Third Party Interference)</text>
    <text x="15" y="190" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fef08a">🛡️ Fair Play Enforced</text>
    <text x="15" y="225" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#fef08a">🚫 No Passive Camping</text>
    <line x1="10" y1="245" x2="310" y2="245" stroke="#facc15" stroke-width="1.5" opacity="0.5" />
    <text x="15" y="280" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">MAP: <tspan fill="#ffffff">Iron Cage</tspan></text>
    <text x="15" y="310" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">ROUNDS: <tspan fill="#ffffff">First to 5 Wins</tspan></text>
    <text x="15" y="340" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">MODE: <tspan fill="#fde047">Solo 1v1</tspan></text>
    <text x="15" y="370" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#c084fc">RECORDING: <tspan fill="#4ade80">Mandatory</tspan></text>
  </g>

  <!-- Overlay on WIN Trophy -->
  <g transform="translate(600, 652)">
    <rect x="0" y="-6" width="380" height="66" rx="18" fill="#070110" stroke="#facc15" stroke-width="3" />
    <text x="190" y="42" text-anchor="middle" font-family="'Rajdhani', 'Impact', sans-serif" font-weight="900" font-size="34" font-style="italic" fill="#fde047" letter-spacing="2">
      🏆 WIN ₹80-₹360
    </text>
  </g>

  ${socialBadge}
</svg>`;

fs.writeFileSync('public/poster-br-solo.svg', brSoloSvg);
fs.writeFileSync('public/poster-br-duo.svg', brDuoSvg);
fs.writeFileSync('public/poster-cs.svg', csHeadshotSvg);
fs.writeFileSync('public/poster-lone-wolf.svg', loneWolfSvg);

console.log('✅ Successfully built consistent SVG posters with xlink:href & fallback JPGs!');
