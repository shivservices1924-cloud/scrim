import fs from 'fs';
import path from 'path';

const outDir = 'public/avatars';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Avatar 1: Cyber Shinobi (Purple Mask & Visor)
const avatar1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e053a" />
      <stop offset="100%" stop-color="#080112" />
    </linearGradient>
    <linearGradient id="p1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g1)" stroke="#a855f7" stroke-width="4" />
  <!-- Spiky Anime Hair -->
  <path d="M 40 100 L 70 40 L 95 65 L 120 30 L 140 65 L 165 45 L 160 100 Z" fill="#e2e8f0" />
  <!-- Masked Face Base -->
  <circle cx="100" cy="115" r="48" fill="#18072b" stroke="#7e22ce" stroke-width="2" />
  <!-- Cyber Visor / Eyes -->
  <polygon points="65,95 135,95 125,110 75,110" fill="#f43f5e" />
  <polygon points="70,98 130,98 122,107 78,107" fill="#fde047" />
  <!-- Lower Face Mask -->
  <path d="M 60 115 L 100 155 L 140 115 L 125 140 L 100 160 L 75 140 Z" fill="url(#p1)" />
  <line x1="85" y1="130" x2="115" y2="130" stroke="#ffffff" stroke-width="2" />
  <line x1="90" y1="140" x2="110" y2="140" stroke="#ffffff" stroke-width="2" />
</svg>`;

// Avatar 2: Fire Crown Emperor
const avatar2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#240742" />
      <stop offset="100%" stop-color="#0a0214" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g2)" stroke="#facc15" stroke-width="4" />
  <!-- Crown -->
  <path d="M 50 85 L 65 50 L 85 75 L 100 35 L 115 75 L 135 50 L 150 85 Z" fill="url(#gold)" stroke="#ca8a04" stroke-width="2" />
  <circle cx="100" cy="50" r="4" fill="#ef4444" />
  <!-- Head & White Hair -->
  <path d="M 55 105 Q 100 120 145 105 Q 130 155 100 165 Q 70 155 55 105 Z" fill="#140624" stroke="#a855f7" stroke-width="2" />
  <!-- Purple Demon Eyes -->
  <polygon points="70,105 90,110 75,115" fill="#c084fc" />
  <polygon points="130,105 110,110 125,115" fill="#c084fc" />
  <!-- Battle Mask -->
  <polygon points="80,125 120,125 100,150" fill="#9333ea" />
  <polygon points="85,128 115,128 100,145" fill="#070212" />
</svg>`;

// Avatar 3: Cyber Skull Operative
const avatar3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b112c" />
      <stop offset="100%" stop-color="#050817" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g3)" stroke="#38bdf8" stroke-width="4" />
  <!-- Skull Head Outline -->
  <path d="M 60 90 Q 100 50 140 90 Q 145 125 125 145 L 115 160 L 85 160 L 75 145 Q 55 125 60 90 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3" />
  <!-- Glowing Cyan Eye Sockets -->
  <circle cx="80" cy="105" r="14" fill="#0f172a" />
  <circle cx="80" cy="105" r="6" fill="#38bdf8" />
  <circle cx="120" cy="105" r="14" fill="#0f172a" />
  <circle cx="120" cy="105" r="6" fill="#38bdf8" />
  <!-- Crosshair on Right Eye -->
  <line x1="120" y1="85" x2="120" y2="125" stroke="#ef4444" stroke-width="2" />
  <line x1="100" y1="105" x2="140" y2="105" stroke="#ef4444" stroke-width="2" />
  <!-- Skull Teeth -->
  <line x1="88" y1="150" x2="88" y2="160" stroke="#475569" stroke-width="2" />
  <line x1="100" y1="150" x2="100" y2="160" stroke="#475569" stroke-width="2" />
  <line x1="112" y1="150" x2="112" y2="160" stroke="#475569" stroke-width="2" />
</svg>`;

// Avatar 4: Golden Phoenix Warrior
const avatar4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b0728" />
      <stop offset="100%" stop-color="#14020e" />
    </linearGradient>
    <linearGradient id="flame" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#facc15" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g4)" stroke="#f43f5e" stroke-width="4" />
  <!-- Phoenix Wing Feathers -->
  <path d="M 30 110 Q 50 60 100 50 Q 150 60 170 110 Q 140 90 100 85 Q 60 90 30 110 Z" fill="url(#flame)" />
  <!-- Hawk/Eagle Helmet -->
  <path d="M 60 90 L 100 65 L 140 90 L 130 135 L 100 160 L 70 135 Z" fill="#1e0917" stroke="#f43f5e" stroke-width="2" />
  <!-- Beak Visor -->
  <polygon points="85,115 115,115 100,150" fill="#facc15" />
  <!-- Blazing Eyes -->
  <polygon points="75,100 90,105 80,110" fill="#fef08a" />
  <polygon points="125,100 110,105 120,110" fill="#fef08a" />
</svg>`;

// Avatar 5: Venom Cobra Striker
const avatar5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10281b" />
      <stop offset="100%" stop-color="#04120b" />
    </linearGradient>
    <linearGradient id="venom" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#16a34a" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g5)" stroke="#22c55e" stroke-width="4" />
  <!-- Cobra Hood -->
  <path d="M 40 100 Q 50 45 100 45 Q 150 45 160 100 Q 145 140 100 155 Q 55 140 40 100 Z" fill="#052e16" stroke="url(#venom)" stroke-width="3" />
  <!-- Inner Mask -->
  <circle cx="100" cy="105" r="35" fill="#021a0d" />
  <!-- Cobra Slit Eyes -->
  <ellipse cx="85" cy="100" rx="6" ry="10" fill="#4ade80" />
  <line x1="85" y1="92" x2="85" y2="108" stroke="#052e16" stroke-width="2.5" />
  <ellipse cx="115" cy="100" rx="6" ry="10" fill="#4ade80" />
  <line x1="115" y1="92" x2="115" y2="108" stroke="#052e16" stroke-width="2.5" />
  <!-- Fangs -->
  <polygon points="90,122 95,122 92.5,135" fill="#f8fafc" />
  <polygon points="105,122 110,122 107.5,135" fill="#f8fafc" />
</svg>`;

// Avatar 6: Cyber Samurai Demon (Hannya Horns)
const avatar6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a0833" />
      <stop offset="100%" stop-color="#0d0212" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#g6)" stroke="#d946ef" stroke-width="4" />
  <!-- Demon Horns -->
  <path d="M 65 65 Q 40 30 35 15 Q 55 35 75 55 Z" fill="#d946ef" />
  <path d="M 135 65 Q 160 30 165 15 Q 145 35 125 55 Z" fill="#d946ef" />
  <!-- Samurai Mask -->
  <path d="M 55 85 L 100 65 L 145 85 L 135 135 L 100 165 L 65 135 Z" fill="#170420" stroke="#a21caf" stroke-width="2.5" />
  <!-- Angry Slanted Eyes -->
  <polygon points="70,95 95,105 75,108" fill="#fde047" />
  <polygon points="130,95 105,105 125,108" fill="#fde047" />
  <!-- Menpo Teeth / Grimace -->
  <rect x="80" y="130" width="40" height="15" rx="3" fill="#3b0742" />
  <line x1="88" y1="130" x2="88" y2="145" stroke="#ffffff" stroke-width="2" />
  <line x1="96" y1="130" x2="96" y2="145" stroke="#ffffff" stroke-width="2" />
  <line x1="104" y1="130" x2="104" y2="145" stroke="#ffffff" stroke-width="2" />
  <line x1="112" y1="130" x2="112" y2="145" stroke="#ffffff" stroke-width="2" />
</svg>`;

fs.writeFileSync(path.join(outDir, 'avatar-1.svg'), avatar1);
fs.writeFileSync(path.join(outDir, 'avatar-2.svg'), avatar2);
fs.writeFileSync(path.join(outDir, 'avatar-3.svg'), avatar3);
fs.writeFileSync(path.join(outDir, 'avatar-4.svg'), avatar4);
fs.writeFileSync(path.join(outDir, 'avatar-5.svg'), avatar5);
fs.writeFileSync(path.join(outDir, 'avatar-6.svg'), avatar6);

console.log('✅ Generated 6 Gaming Avatars in public/avatars/ successfully!');
