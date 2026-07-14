import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(process.cwd(), 'public', 'og');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;

const BG_COLOR = '#0F1117';
const ACCENT = '#C7FF3D';
const TEXT_PRIMARY = '#F7F7F2';
const TEXT_SECONDARY = '#A0A0A0';

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createOgSvg({ title, subtitle, tag, icon }) {
  const titleLines = wrapText(title, 28);
  const titleY = titleLines.length === 1 ? 320 : 290;

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A1D2E;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ACCENT};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#A8E63D;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)" />

  <!-- Grid pattern -->
  <g opacity="0.04">
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${HEIGHT}" stroke="${TEXT_PRIMARY}" stroke-width="1" />`).join('\n    ')}
    ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${WIDTH}" y2="${i * 60}" stroke="${TEXT_PRIMARY}" stroke-width="1" />`).join('\n    ')}
  </g>

  <!-- Accent glow -->
  <circle cx="1000" cy="150" r="200" fill="${ACCENT}" opacity="0.06" />
  <circle cx="200" cy="500" r="150" fill="${ACCENT}" opacity="0.04" />

  <!-- Top accent line -->
  <rect x="0" y="0" width="${WIDTH}" height="4" fill="url(#accentGrad)" />

  <!-- Tag -->
  ${tag ? `
  <rect x="80" y="180" width="${tag.length * 11 + 24}" height="32" rx="6" fill="${ACCENT}" opacity="0.15" />
  <text x="92" y="202" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="${ACCENT}" letter-spacing="1.5">${escapeXml(tag.toUpperCase())}</text>
  ` : ''}

  <!-- Title -->
  ${titleLines.map((line, i) => `<text x="80" y="${titleY + i * 60}" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="${TEXT_PRIMARY}">${escapeXml(line)}</text>`).join('\n  ')}

  <!-- Subtitle -->
  ${subtitle ? `<text x="80" y="${titleY + titleLines.length * 60 + 30}" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="${TEXT_SECONDARY}">${escapeXml(subtitle)}</text>` : ''}

  <!-- Brand -->
  <text x="80" y="${HEIGHT - 50}" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="${TEXT_PRIMARY}">StudentKit</text>
  <text x="210" y="${HEIGHT - 50}" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="${TEXT_SECONDARY}">studentkit.app</text>

  <!-- Bottom accent -->
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="url(#accentGrad)" />

  <!-- Decorative icon area -->
  ${icon ? `<text x="${WIDTH - 150}" y="350" font-size="80" opacity="0.15" fill="${ACCENT}">${icon}</text>` : ''}
</svg>`;
}

function wrapText(text, maxChars) {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.slice(0, 3);
}

const pages = [
  // Home
  { filename: 'home.png', title: 'Calculate. Learn. Build.', subtitle: 'Free tools, roadmaps, and projects for students', tag: 'StudentKit', icon: null },

  // Main sections
  { filename: 'tools.png', title: 'Student Tools', subtitle: '21+ free calculators and developer utilities', tag: 'Calculate', icon: null },
  { filename: 'roadmaps.png', title: 'Interactive Roadmaps', subtitle: 'Step-by-step career paths with progress tracking', tag: 'Learn', icon: null },
  { filename: 'projects.png', title: 'Open Source Projects', subtitle: 'Discover GitHub repos by difficulty and tech stack', tag: 'Build', icon: null },

  // Tool categories
  { filename: 'tools-cgpa-calculator.png', title: 'CGPA Calculator', subtitle: 'Calculate your cumulative GPA instantly', tag: 'Academic Tools', icon: null },
  { filename: 'tools-sgpa-calculator.png', title: 'SGPA Calculator', subtitle: 'Semester GPA calculation made simple', tag: 'Academic Tools', icon: null },
  { filename: 'tools-cgpa-to-percentage.png', title: 'CGPA to Percentage', subtitle: 'Convert CGPA to percentage for any university', tag: 'Academic Tools', icon: null },
  { filename: 'tools-attendance-calculator.png', title: 'Attendance Calculator', subtitle: 'Track and plan your attendance percentage', tag: 'Academic Tools', icon: null },
  { filename: 'tools-marks-percentage-calculator.png', title: 'Marks Percentage Calculator', subtitle: 'Calculate percentage from marks obtained', tag: 'Academic Tools', icon: null },
  { filename: 'tools-age-calculator.png', title: 'Age Calculator', subtitle: 'Calculate exact age in years, months, and days', tag: 'Utilities', icon: null },
  { filename: 'tools-ctc-to-inhand-calculator.png', title: 'CTC to In-Hand Calculator', subtitle: 'Know your actual take-home salary', tag: 'Career Tools', icon: null },
  { filename: 'tools-salary-calculator.png', title: 'Salary Calculator', subtitle: 'Calculate salary breakdowns and deductions', tag: 'Career Tools', icon: null },
  { filename: 'tools-image-compressor.png', title: 'Image Compressor', subtitle: 'Compress images without losing quality', tag: 'Image Tools', icon: null },
  { filename: 'tools-image-resizer.png', title: 'Image Resizer', subtitle: 'Resize images to any dimension instantly', tag: 'Image Tools', icon: null },
  { filename: 'tools-signature-resizer.png', title: 'Signature Resizer', subtitle: 'Resize signatures for exam forms and documents', tag: 'Image Tools', icon: null },
  { filename: 'tools-color-palette-generator.png', title: 'Color Palette Generator', subtitle: 'Generate beautiful color schemes for your projects', tag: 'Design Tools', icon: null },
  { filename: 'tools-image-color-picker.png', title: 'Image Color Picker', subtitle: 'Extract colors from any image', tag: 'Design Tools', icon: null },
  { filename: 'tools-readme-generator.png', title: 'README Generator', subtitle: 'Generate professional README files instantly', tag: 'Dev Tools', icon: null },
  { filename: 'tools-gitignore-generator.png', title: '.gitignore Generator', subtitle: 'Create .gitignore files for any tech stack', tag: 'Dev Tools', icon: null },
  { filename: 'tools-project-structure-generator.png', title: 'Project Structure Generator', subtitle: 'Generate clean folder structures for projects', tag: 'Dev Tools', icon: null },
  { filename: 'tools-json-formatter.png', title: 'JSON Formatter', subtitle: 'Format, validate, and beautify JSON data', tag: 'Dev Tools', icon: null },
  { filename: 'tools-regex-tester.png', title: 'Regex Tester', subtitle: 'Test and debug regular expressions live', tag: 'Dev Tools', icon: null },
  { filename: 'tools-base64-encoder.png', title: 'Base64 Encoder/Decoder', subtitle: 'Encode and decode Base64 strings', tag: 'Dev Tools', icon: null },
  { filename: 'tools-lorem-ipsum-generator.png', title: 'Lorem Ipsum Generator', subtitle: 'Generate placeholder text for your designs', tag: 'Dev Tools', icon: null },
  { filename: 'tools-uuid-generator.png', title: 'UUID Generator', subtitle: 'Generate unique identifiers instantly', tag: 'Dev Tools', icon: null },

  // Roadmaps
  { filename: 'roadmaps-frontend-developer.png', title: 'Frontend Developer Roadmap', subtitle: 'HTML, CSS, JavaScript, React and beyond', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-backend-developer.png', title: 'Backend Developer Roadmap', subtitle: 'APIs, databases, and server architecture', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-full-stack-developer.png', title: 'Full Stack Developer Roadmap', subtitle: 'End-to-end web development mastery', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-ai-engineer.png', title: 'AI / ML Engineer Roadmap', subtitle: 'Machine learning, deep learning, and AI apps', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-mobile-developer.png', title: 'Mobile Developer Roadmap', subtitle: 'Flutter, React Native, and native development', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-devops-engineer.png', title: 'DevOps Engineer Roadmap', subtitle: 'CI/CD, containers, cloud infrastructure', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-cybersecurity.png', title: 'Cybersecurity Roadmap', subtitle: 'Network security and ethical hacking', tag: 'Roadmap', icon: null },
  { filename: 'roadmaps-placement-preparation.png', title: 'Placement Preparation Roadmap', subtitle: 'DSA, aptitude, and interview strategy', tag: 'Roadmap', icon: null },
];

async function generate() {
  console.log(`Generating ${pages.length} OG images...`);

  for (const page of pages) {
    const svg = createOgSvg(page);
    const buffer = Buffer.from(svg);

    await sharp(buffer)
      .resize(WIDTH, HEIGHT)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(join(OUT_DIR, page.filename));

    console.log(`  ✓ ${page.filename}`);
  }

  console.log(`\nDone! ${pages.length} images saved to public/og/`);
}

generate().catch(console.error);
