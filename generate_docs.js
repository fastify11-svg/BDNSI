#!/usr/bin/env node
/**
 * BDNSI — Generate PROJECT_MASTER_DOCUMENTATION.pdf from Markdown
 * Uses Node.js built-ins only (no external Puppeteer needed)
 * Generates a professional HTML → PDF via print-friendly HTML
 */

const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'PROJECT_MASTER_DOCUMENTATION.md');
const htmlPath = path.join(__dirname, 'PROJECT_MASTER_DOCUMENTATION.html');
const pdfPath = path.join(__dirname, 'PROJECT_MASTER_DOCUMENTATION.pdf');

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Simple Markdown to HTML converter
function mdToHtml(md) {
  let html = md;

  // Code blocks
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) =>
    `<pre><code>${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`
  );

  // Headings
  html = html.replace(/^#{1} (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^#{2} (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#{3} (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{4} (.+)$/gm, '<h4>$1</h4>');

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, row) => {
    const cells = row.split('|').map(c => c.trim());
    return '<tr>' + cells.map(c => {
      if (c.match(/^[\s:-]+$/)) return '';
      return `<td>${c}</td>`;
    }).filter(Boolean).join('') + '</tr>';
  });
  html = html.replace(/(<tr>.*<\/tr>\n)+/g, match =>
    '<table>' + match + '</table>'
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)\n(?!<li>)/g, '$1\n</ul>\n');
  html = html.replace(/(?<!<\/li>\n)(<li>)/g, '<ul>\n$1');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
  html = html.replace(/(<oli>[\s\S]*?<\/oli>)\n(?!<oli>)/g, '$1\n</ol>\n');
  html = html.replace(/(?<!<\/oli>\n)(<oli>)/g, '<ol>\n$1');
  html = html.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>');

  // Paragraphs
  html = html.replace(/^(?!<[a-zA-Z]|  |\t)(.+)$/gm, '<p>$1</p>');

  // Clean up multiple newlines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html;
}

const bodyHtml = mdToHtml(mdContent);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BDNSI — Project Master Documentation</title>
<style>
  @page { margin: 2cm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a2e;
    background: white;
  }
  .cover-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: white;
    page-break-after: always;
    padding: 3cm;
  }
  .cover-page h1 { font-size: 36pt; margin-bottom: 0.5cm; color: #e94560; }
  .cover-page h2 { font-size: 18pt; margin-bottom: 1cm; opacity: 0.9; }
  .cover-page .meta { font-size: 12pt; opacity: 0.75; line-height: 2; }
  .cover-page .badge {
    display: inline-block;
    background: #e94560;
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    margin-top: 1cm;
    font-weight: bold;
  }
  .content { padding: 1cm 0; }
  h1 { font-size: 22pt; color: #0f3460; border-bottom: 3px solid #e94560; padding-bottom: 6px; margin: 1.2cm 0 0.4cm; page-break-after: avoid; }
  h2 { font-size: 16pt; color: #16213e; border-left: 4px solid #e94560; padding-left: 10px; margin: 0.8cm 0 0.3cm; page-break-after: avoid; }
  h3 { font-size: 13pt; color: #0f3460; margin: 0.6cm 0 0.2cm; page-break-after: avoid; }
  h4 { font-size: 11pt; color: #444; margin: 0.4cm 0 0.1cm; page-break-after: avoid; }
  p { margin: 0.3cm 0; }
  table { width: 100%; border-collapse: collapse; margin: 0.4cm 0; font-size: 9.5pt; page-break-inside: avoid; }
  th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; vertical-align: top; }
  tr:nth-child(even) { background: #f5f7ff; }
  tr:first-child td { background: #1a1a2e; color: white; font-weight: bold; }
  pre { background: #1a1a2e; color: #a8ff78; padding: 12px; border-radius: 6px; overflow-x: auto; font-family: 'Consolas', monospace; font-size: 8.5pt; margin: 0.3cm 0; page-break-inside: avoid; }
  code { font-family: 'Consolas', monospace; background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 9pt; }
  pre code { background: none; padding: 0; color: inherit; }
  ul, ol { margin: 0.2cm 0 0.2cm 1cm; }
  li { margin: 2px 0; }
  hr { border: none; border-top: 2px solid #e94560; margin: 0.6cm 0; }
  strong { font-weight: bold; color: #0f3460; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>

<div class="cover-page">
  <h1>BDNSI</h1>
  <h2>Bangladesh National Skills Institute<br>Management System</h2>
  <h2 style="font-size:14pt;margin-top:0.5cm;color:#a8d8ea;">PROJECT MASTER DOCUMENTATION</h2>
  <div class="meta">
    <div>Documentation Version: 1.0</div>
    <div>Audit Date: 2026-08-24</div>
    <div>Audited By: Antigravity AI Architect</div>
    <div>Based On: Direct source code inspection</div>
    <div>Project Path: c:\\BDNSI</div>
    <div>Live URL: https://nenobet.live</div>
  </div>
  <div class="badge">Completion: ~70-75%</div>
</div>

<div class="content">
${bodyHtml}
</div>

</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('HTML generated:', htmlPath);

// Try to use available PDF generation
const { execSync } = require('child_process');

// Method 1: Try wkhtmltopdf if available
let pdfGenerated = false;
try {
  execSync(`wkhtmltopdf --quiet --page-size A4 --margin-top 20 --margin-bottom 20 --margin-left 15 --margin-right 15 "${htmlPath}" "${pdfPath}"`, { timeout: 60000 });
  console.log('PDF generated via wkhtmltopdf:', pdfPath);
  pdfGenerated = true;
} catch(e) {
  console.log('wkhtmltopdf not available, trying alternative...');
}

if (!pdfGenerated) {
  // Method 2: Try Chrome headless if available
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\Naeem\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const chromePath of chromePaths) {
    if (fs.existsSync(chromePath)) {
      try {
        execSync(`"${chromePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`, { timeout: 60000 });
        console.log('PDF generated via Chrome headless:', pdfPath);
        pdfGenerated = true;
        break;
      } catch(e) {
        console.log('Chrome headless failed:', e.message.substring(0, 100));
      }
    }
  }
}

if (!pdfGenerated) {
  console.log('');
  console.log('PDF GENERATION NOTE:');
  console.log('The HTML file has been created at: PROJECT_MASTER_DOCUMENTATION.html');
  console.log('To generate the PDF, open it in Chrome and use File > Print > Save as PDF');
  console.log('Or install wkhtmltopdf: https://wkhtmltopdf.org/');
  console.log('');
  console.log('The HTML file is fully print-ready with professional styling.');
  
  // Create a placeholder PDF note file
  fs.writeFileSync(pdfPath + '.note.txt', 
    'PDF GENERATION INSTRUCTIONS\n' +
    '============================\n\n' +
    'The PROJECT_MASTER_DOCUMENTATION.html file is ready.\n\n' +
    'To generate PDF:\n' +
    '1. Open PROJECT_MASTER_DOCUMENTATION.html in Chrome\n' +
    '2. Press Ctrl+P (Print)\n' +
    '3. Select "Save as PDF"\n' +
    '4. Save as PROJECT_MASTER_DOCUMENTATION.pdf\n\n' +
    'OR install wkhtmltopdf:\n' +
    'https://wkhtmltopdf.org/downloads.html\n' +
    'Then run: wkhtmltopdf PROJECT_MASTER_DOCUMENTATION.html PROJECT_MASTER_DOCUMENTATION.pdf\n'
  );
}

console.log('\nDocumentation generation complete!');
console.log('Files created:');
console.log('  - PROJECT_MASTER_DOCUMENTATION.md');
console.log('  - PROJECT_MASTER_DOCUMENTATION.html (professional print-ready)');
if (pdfGenerated) {
  console.log('  - PROJECT_MASTER_DOCUMENTATION.pdf');
} else {
  console.log('  - PROJECT_MASTER_DOCUMENTATION.pdf.note.txt (PDF instructions)');
}
