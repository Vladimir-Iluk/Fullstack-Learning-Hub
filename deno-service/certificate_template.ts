/**
 * ═══════════════════════════════════════════════════════
 * SVG Certificate Template Generator
 * Topic #8: Deno microservice
 * ═══════════════════════════════════════════════════════
 */

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

/**
 * Generate a beautiful SVG certificate
 */
export function generateCertificateSVG(data: CertificateData): string {
  const { studentName, courseName, completionDate, certificateId } = data;

  const formattedDate = new Date(completionDate).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 566" width="800" height="566">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0f23;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a3e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6366f1" />
      <stop offset="100%" style="stop-color:#8b5cf6" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f59e0b" />
      <stop offset="100%" style="stop-color:#fbbf24" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="566" fill="url(#bg)" rx="12"/>
  
  <!-- Decorative border -->
  <rect x="16" y="16" width="768" height="534" fill="none" stroke="url(#accent)" stroke-width="2" rx="8" opacity="0.6"/>
  <rect x="24" y="24" width="752" height="518" fill="none" stroke="url(#gold)" stroke-width="1" rx="6" opacity="0.3"/>

  <!-- Corner decorations -->
  <circle cx="50" cy="50" r="6" fill="url(#accent)" opacity="0.5"/>
  <circle cx="750" cy="50" r="6" fill="url(#accent)" opacity="0.5"/>
  <circle cx="50" cy="516" r="6" fill="url(#accent)" opacity="0.5"/>
  <circle cx="750" cy="516" r="6" fill="url(#accent)" opacity="0.5"/>

  <!-- Top accent line -->
  <rect x="200" y="60" width="400" height="3" fill="url(#accent)" rx="1.5"/>

  <!-- Logo / Title -->
  <text x="400" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#8b5cf6" letter-spacing="6">
    DEVHUB LMS
  </text>

  <!-- Certificate Title -->
  <text x="400" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="url(#gold)" font-weight="bold">
    СЕРТИФІКАТ
  </text>
  <text x="400" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" letter-spacing="3">
    ПРО ЗАВЕРШЕННЯ КУРСУ
  </text>

  <!-- Divider -->
  <rect x="300" y="200" width="200" height="1" fill="#6366f1" opacity="0.4"/>

  <!-- Student Name -->
  <text x="400" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#94a3b8">
    Цим засвідчується, що
  </text>
  <text x="400" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#e2e8f0" font-weight="bold">
    ${escapeXml(studentName)}
  </text>

  <!-- Underline -->
  <rect x="200" y="295" width="400" height="1" fill="url(#accent)" opacity="0.5"/>

  <!-- Course info -->
  <text x="400" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#94a3b8">
    успішно завершив(ла) курс
  </text>
  <text x="400" y="365" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#a78bfa">
    «${escapeXml(courseName)}»
  </text>

  <!-- Date -->
  <text x="400" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#64748b">
    Дата завершення: ${formattedDate}
  </text>

  <!-- Bottom divider -->
  <rect x="250" y="435" width="300" height="1" fill="#6366f1" opacity="0.3"/>

  <!-- Signature area -->
  <text x="200" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#c4b5fd" font-style="italic">
    DevHub Team
  </text>
  <rect x="130" y="480" width="140" height="1" fill="#6366f1" opacity="0.4"/>
  <text x="200" y="498" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#64748b">
    Платформа DevHub LMS
  </text>

  <!-- Medal icon -->
  <circle cx="600" cy="475" r="20" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <text x="600" y="481" text-anchor="middle" font-size="20">🏆</text>

  <!-- Certificate ID -->
  <text x="400" y="530" text-anchor="middle" font-family="monospace" font-size="10" fill="#475569">
    ID: ${escapeXml(certificateId)}
  </text>
</svg>`;
}

/**
 * Escape special characters for XML/SVG
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
