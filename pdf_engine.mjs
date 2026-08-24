import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Enterprise Headless Chromium PDF Generator Engine
 * Usage: node pdf_engine.mjs --html="<html_file>" --output="<pdf_file>" --format="A4" --landscape="false"
 */

async function main() {
    const args = process.argv.slice(2);
    const params = {};

    args.forEach(arg => {
        const match = arg.match(/^--([^=]+)=(.*)$/);
        if (match) {
            params[match[1]] = match[2];
        }
    });

    const htmlPath = params.html;
    const url = params.url;
    const outputPath = params.output;
    const format = (params.format || 'A4').toUpperCase();
    const landscape = params.landscape === 'true' || params.orientation === 'landscape';
    const scale = parseFloat(params.scale || '1.0');

    if (!outputPath || (!htmlPath && !url)) {
        console.error(JSON.stringify({
            status: 'error',
            message: 'Missing required arguments: --output and either --html or --url'
        }));
        process.exit(1);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(path.resolve(outputPath));
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let browser;
    try {
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--font-render-hinting=medium',
            ]
        });

        const context = await browser.newContext({
            viewport: { width: 1280, height: 900 },
            deviceScaleFactor: 2,
        });

        const page = await context.newPage();

        if (htmlPath) {
            const absoluteHtmlPath = path.resolve(htmlPath);
            const htmlContent = fs.readFileSync(absoluteHtmlPath, 'utf8');
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle',
                timeout: 30000
            });
        } else if (url) {
            await page.goto(url, {
                waitUntil: 'networkidle',
                timeout: 30000
            });
        }

        // Wait for all web fonts and images to settle
        await page.evaluate(async () => {
            if (document.fonts) {
                await document.fonts.ready;
            }
        });

        // Configure PDF output layout
        const pdfOptions = {
            path: path.resolve(outputPath),
            printBackground: true,
            scale: scale,
            landscape: landscape,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        };

        if (format === 'CR80') {
            // Standard Credit Card / ID Card dimensions: 85.6mm x 53.98mm (or 3.375in x 2.125in)
            pdfOptions.width = landscape ? '85.6mm' : '53.98mm';
            pdfOptions.height = landscape ? '53.98mm' : '85.6mm';
        } else if (['A4', 'A3', 'A5', 'LETTER', 'LEGAL'].includes(format)) {
            pdfOptions.format = format === 'LETTER' ? 'Letter' : (format === 'LEGAL' ? 'Legal' : format);
        } else {
            pdfOptions.format = 'A4';
        }

        await page.pdf(pdfOptions);

        await browser.close();

        const stats = fs.statSync(outputPath);

        console.log(JSON.stringify({
            status: 'success',
            output: path.resolve(outputPath),
            size: stats.size,
            format: format,
            landscape: landscape,
        }));
        process.exit(0);
    } catch (err) {
        if (browser) {
            await browser.close().catch(() => {});
        }
        console.error(JSON.stringify({
            status: 'error',
            message: err.message,
            stack: err.stack,
        }));
        process.exit(1);
    }
}

main();
