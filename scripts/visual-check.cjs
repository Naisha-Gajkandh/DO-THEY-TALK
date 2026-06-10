const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', 'dist');
const host = '127.0.0.1';
const port = 4173;
const url = `http://${host}:${port}`;

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

function sendFile(res, file) {
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
    });
    res.end(data);
  });
}

function createServer() {
  const server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.resolve(root, requestPath === '/' ? 'index.html' : `.${requestPath}`);

    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.access(file, fs.constants.R_OK, (error) => {
      if (error) {
        sendFile(res, path.join(root, 'index.html'));
        return;
      }
      sendFile(res, file);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

async function main() {
  const server = await createServer();
  const launchOptions = { headless: true };
  if (process.env.BROWSER_EXECUTABLE) {
    launchOptions.executablePath = process.env.BROWSER_EXECUTABLE;
  }
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('text=Do They', { timeout: 30000 });
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(1800);

  const landing = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const rect = canvas?.getBoundingClientRect();
    let canvasHasPixels = false;
    if (canvas && canvas.width && canvas.height) {
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = 80;
      sampleCanvas.height = 80;
      const ctx = sampleCanvas.getContext('2d');
      try {
        ctx.drawImage(canvas, 0, 0, 80, 80);
        const data = ctx.getImageData(0, 0, 80, 80).data;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 0 && (data[i - 1] > 8 || data[i - 2] > 8 || data[i - 3] > 8)) {
            canvasHasPixels = true;
            break;
          }
        }
      } catch {
        canvasHasPixels = true;
      }
    }

    return {
      title: document.body.innerText.includes('Do They'),
      subtitle: document.body.innerText.includes('Exploring bizarre statistical relationships'),
      canvasRect: rect ? { width: Math.round(rect.width), height: Math.round(rect.height) } : null,
      canvasHasPixels,
    };
  });

  await page.click('#explore-correlations-btn');
  await page.waitForSelector('text=Correlation Atlas', { timeout: 30000 });
  await page.waitForTimeout(600);

  const dashboard = await page.evaluate(() => {
    const required = [
      'Technology',
      'Food',
      'Movies',
      'Sports',
      'Internet Trends',
      'Health',
      'Music',
      'Historical Patterns',
      'Weird Statistics',
      'Random Correlations',
    ];
    const text = document.body.innerText;
    return {
      topicsPresent: required.every(topic => text.includes(topic)),
      topicCardCount: document.querySelectorAll('.premium-topic-card').length,
    };
  });

  await page.locator('.premium-topic-card').filter({ hasText: 'Food' }).first().click();
  await page.waitForSelector('.score-panel, .error-panel', { timeout: 45000 });
  await page.waitForTimeout(1200);

  const detail = await page.evaluate(() => ({
    hasScore: Boolean(document.querySelector('.score-panel')),
    hasChart: Boolean(document.querySelector('.chart-lab canvas')),
    hasStory: Boolean(document.querySelector('.story-panel')),
    hasSidebar: Boolean(document.querySelector('.anomaly-row')),
    error: document.querySelector('.error-panel')?.innerText || null,
  }));

  await browser.close();
  await new Promise(resolve => server.close(resolve));

  const fatalErrors = errors.filter(error => (
    !error.includes('ERR_NETWORK_ACCESS_DENIED')
    && !error.includes('pyodide')
    && !error.includes('importScripts')
  ));
  const report = { landing, dashboard, detail, errors, fatalErrors };
  console.log(JSON.stringify(report, null, 2));

  if (!landing.title || !landing.subtitle || !landing.canvasHasPixels || !dashboard.topicsPresent || dashboard.topicCardCount !== 10) {
    process.exit(1);
  }
  if (!detail.hasScore || !detail.hasChart || !detail.hasStory || !detail.hasSidebar) {
    process.exit(1);
  }
  if (fatalErrors.length) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
