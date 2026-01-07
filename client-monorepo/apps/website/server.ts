import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { HttpErrorResponse } from '@angular/common/http';
import AppServerModule from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createClient } from 'redis';
import { environment } from './src/environments/environment';
import { REQUEST, RESPONSE } from './ssr/express.tokens';
import { isMobile } from './ssr/helpers';
import { existsSync } from 'node:fs';
import { RedirectService } from './ssr/redirect.service';
import pLimit from 'p-limit';
import { LRUCache } from 'lru-cache';

const md5 = require('md5');

// Redis Client Configuration
const client = createClient({
  url: `redis://${environment.redis.host}:${environment.redis.port}`,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 5000),
  },
});

client.on('error', (err) => console.error('Redis Client Error:', err));

const SSR_CONCURRENCY = Number(process.env.SSR_CONCURRENCY || 4);
const limit = pLimit(SSR_CONCURRENCY);

const wrapLimit = (fn: (req: express.Request, res: express.Response) => Promise<any>) => (req: express.Request, res: express.Response) => {
  // returns a Promise which p-limit uses to control concurrency
  return limit(() => fn(req, res));
};

// 🧠 Lightweight local LRU cache to reduce re-rendering same URLs
const ssrLruCache = new LRUCache<string, { html: string; createdAt: number }>({
  max: 300, // store up to 300 pages
  ttl: 1000 * 60 * 60, // 60 minutes
});

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();

  // Middleware
  server.use(express.json());
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Static files
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    }),
  );

  // Cache management endpoints
  server.post('/cache/invalidate', async (req, res) => {
    if (!req.body.url) return res.status(400).send('URL is required');
    await invalidateCache(req.body.url);
    res.send('Cache invalidated');
  });

  server.post('/cache/invalidate-all', async (_req, res) => {
    await invalidateAllCache();
    res.send('All cache invalidated');
  });

  // Main SSR handler
  server.get(
    '*',
    wrapLimit(async (req, res) => {
      if (!req.originalUrl.startsWith('/.') && !req.originalUrl.endsWith('.map') && !req.originalUrl.endsWith('.js')) {
        console.log(`[Worker ${process.pid}] Handling ${req.originalUrl}`);
        const [pathUrl, query] = req.originalUrl.split('?');
        const redirect = await RedirectService.checkRedirect(pathUrl);
        if (redirect?.redirect) {
          if (redirect.statusCode === '410') {
            return res.status(410).send('<h1>410 - Gone</h1>');
          }
          return res.redirect(Number(redirect.statusCode), redirect.redirectTo + (query?.length ? '?' + query : ''));
        }

        const { protocol, originalUrl, baseUrl, headers } = req;
        const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const renderStartTime = Date.now();

        const isUserAgentMobile = isMobile(req.headers['user-agent']);
        let modifiedUrl = originalUrl;
        if (isUserAgentMobile && !originalUrl.includes('/api')) {
          modifiedUrl = '/m' + modifiedUrl;
        }

        const hash = md5(modifiedUrl);
        const cacheEnabled = environment.ssrCacheEnabled;

        try {
          // 🧠 Check in-memory LRU cache first (fast path)
          const cachedLru = ssrLruCache.get(`SSR_${hash}`);
          if (cachedLru?.html && cachedLru?.html.trim() !== '') {
            res.set({
              'X-SSR-Cache': 'lru-hit',
              'Cache-Control': 'public, max-age=120',
            });
            return res.status(200).send(cachedLru.html);
          }

          // Cache check
          if (cacheEnabled) {
            const cached = await checkRedisStatus(hash, modifiedUrl);
            if (cached) {
              if (cached.status === 200 && cached.html && cached.html.trim() !== '') {
                res.set({
                  'X-SSR-Cache': 'hit',
                  'Cache-Control': `public, max-age=${Math.max(0, cached.expiresAt - Math.floor(Date.now() / 1000))}`,
                });
                // 🧠 Rewarm the in-memory LRU so next local request is instant
                ssrLruCache.set(`SSR_${hash}`, { html: cached.html, createdAt: Date.now() });
                return res.status(200).send(cached.html);
              } else {
                console.warn(`[${requestId}] Cache hit but empty HTML for ${modifiedUrl}`);
                return errorPage(req, res, cached.status || 500);
              }
            }
          }

          // 2️⃣ Render fresh
          const html = await Promise.race([
            commonEngine.render({
              bootstrap: AppServerModule,
              documentFilePath: indexHtml,
              url: `${protocol}://${headers.host}${originalUrl}`,
              publicPath: browserDistFolder,
              providers: [
                { provide: APP_BASE_HREF, useValue: baseUrl },
                { provide: RESPONSE, useValue: res },
                { provide: REQUEST, useValue: req },
              ],
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`SSR render timeout after 15s for ${originalUrl}`)), 15000),
            ),
          ]);

          // 🧠 Optimization: proactively cleanup Angular platform to free memory
          try {
            (global as any).ngServerPlatformRef?.destroy?.();
            delete (global as any).ngServerPlatformRef;
          } catch (cleanupErr) {
            console.warn('Angular platform cleanup failed:', cleanupErr);
          }

          const renderTime = Date.now() - renderStartTime;

          // Empty HTML guard
          if (!html || html.trim() === '') {
            console.error(`[${requestId}] ❌ SSR returned empty HTML for ${originalUrl}`);

            // Fallback to CSR
            const clientIndex = join(browserDistFolder, 'index.html');
            if (existsSync(clientIndex)) {
              console.warn(`[${requestId}] Falling back to CSR index.html for ${originalUrl}`);
              return res.status(200).sendFile(clientIndex);
            }
            throw new Error('SSR_EMPTY_OUTPUT');
          }

          // 4️⃣ Cache successful render
          if (cacheEnabled) {
            try {
              await storeStatusInCache(modifiedUrl, 200, html);
            } catch (cacheError) {
              console.error(`[${requestId}] Failed to cache render:`, cacheError);
            }
          }

          res.set({
            'X-SSR-Cache': 'miss',
            'Cache-Control': 'public, max-age=300',
            'X-Render-Time': renderTime.toString(),
          });

          // 5️⃣ Detect Angular 404 component
          if (html.includes('<app-not-found')) {
            console.log(`[${requestId}] SSR rendered NotFoundComponent for ${originalUrl}`);
            res.status(404);
          }

          return res.send(html);
        } catch (error: any) {
          const renderTime = Date.now() - (renderStartTime || Date.now());
          console.error(`[${requestId}] SSR Error after ${renderTime}ms for ${originalUrl}:`, {
            message: error.message,
            stack: error.stack,
            url: originalUrl,
            modifiedUrl,
          });

          // 6️⃣ Status handling
          let statusCode = 500;
          if (error instanceof HttpErrorResponse) statusCode = error.status;
          else if (error.message?.includes('timeout')) statusCode = 504;
          else if (error.message?.includes('ENOTFOUND') || error.message?.includes('ECONNREFUSED')) statusCode = 502;
          else if (error.message?.includes('fetch failed')) statusCode = 502;
          else if (error.message?.includes('SSR_EMPTY_OUTPUT')) statusCode = 500;

          if (cacheEnabled) {
            try {
              await storeStatusInCache(modifiedUrl, statusCode);
            } catch (cacheError) {
              console.error(`[${requestId}] Failed to cache error:`, cacheError);
            }
          }

          if (statusCode === 404) return errorPage(req, res, 404);
          if (statusCode === 502 || statusCode === 504) {
            res.status(statusCode).set({
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Retry-After': '60',
            });
            return res.send(getServiceUnavailableHtml());
          }

          res.status(statusCode).set({
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          });
          return res.send(getServerErrorHtml(requestId));
        }
      }
    }),
  );

  // 🧠 Memory logging for monitoring
  setInterval(() => {
    const mem = process.memoryUsage();
    console.log(
      `MEMORY | RSS: ${(mem.rss / 1024 / 1024).toFixed(1)} MB | HeapUsed: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB | HeapTotal: ${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`,
    );
  }, 60000);

  return server;
}

// Cache Methods
async function checkRedisStatus(hash: string, url: string) {
  try {
    await client.select(1);
    const CACHE_KEY = `SSR_${hash}`;
    const value = await client.get(CACHE_KEY);
    if (!value) return null;

    const data = JSON.parse(value);
    const now = Math.floor(Date.now() / 1000);

    if (now > data.expiresAt || !data.html || data.html.trim().length < 1) {
      console.warn(`[CACHE] Removing stale/empty cache for ${url}`);
      await client.del(CACHE_KEY);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Redis cache check failed:', e);
    return null;
  }
}

async function storeStatusInCache(url: string, status: number, html?: string) {
  try {
    const hash = md5(url);
    await client.select(1);
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (environment.ssrCacheTTL || 300);

    if (status === 200 && (!html || html.trim() === '')) {
      console.warn(`[CACHE] Skipping cache for ${url} due to empty HTML`);
      return;
    }

    // 🧠 Also store result in in-memory LRU for fast next-hit
    ssrLruCache.set(`SSR_${hash}`, { html, createdAt: Date.now() });
    await client.set(`SSR_${hash}`, JSON.stringify({ status, expiresAt, html, timestamp: now }), { EX: environment.ssrCacheTTL || 300 });
  } catch (e) {
    console.error('Failed to store in Redis:', e);
  }
}

async function invalidateCache(url: string) {
  const hash = md5(url);
  try {
    await client.select(1);
    await client.del(`SSR_${hash}`);
    ssrLruCache.delete(`SSR_${hash}`);
  } catch (e) {
    console.error('Cache invalidation failed:', e);
  }
}

async function invalidateAllCache() {
  try {
    await client.select(1);
    const keys = await client.keys('SSR_*');
    ssrLruCache.clear();
    if (keys.length) await client.del(keys);
  } catch (e) {
    console.error('Full cache invalidation failed:', e);
  }
}

// Error Pages
function errorPage(req: express.Request, res: express.Response, statusCode: number) {
  const distFolder = join(process.cwd(), 'dist/website/browser');
  const errorPage = join(distFolder, `error-${statusCode}.html`);
  res.set('Content-Type', 'text/html');
  res.status(statusCode === 200 ? 500 : statusCode);
  if (existsSync(errorPage)) return res.sendFile(errorPage);
  res.send(`<h1>${statusCode} Error</h1>`);
}

function getServiceUnavailableHtml(): string {
  return `
  <!DOCTYPE html>
  <html><head>
    <title>Service Temporarily Unavailable</title>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
      .error { color: #666; } .retry { margin-top: 20px; }
    </style>
  </head>
  <body>
    <h1>Service Temporarily Unavailable</h1>
    <p class="error">We're experiencing technical difficulties. Please try again shortly.</p>
    <div class="retry"><button onclick="window.location.reload()">Retry</button></div>
    <script>setTimeout(()=>window.location.reload(),30000);</script>
  </body></html>`;
}

function getServerErrorHtml(requestId: string): string {
  return `
  <!DOCTYPE html>
  <html><head>
    <title>Server Error</title>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  </head><body>
    <h1>Server Error</h1>
    <p>Something went wrong. Please try again later.</p>
    <p><small>Request ID: ${requestId}</small></p>
  </body></html>`;
}

// Startup
async function run(): Promise<void> {
  const port = process.env['PORT'] || 4000;
  try {
    await client.connect();
    console.log('Connected to Redis');
    const server = app();
    server.listen(port, () => console.log(`✅ SSR server listening on http://localhost:${port}`));
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}
run();

process.on('SIGINT', async () => {
  console.log('🧹 Gracefully shutting down (SIGINT)...');
  try {
    await client.quit();
  } catch (e) {
    console.error('Error closing Redis connection:', e);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🧹 Received SIGTERM. Cleaning up...');
  try {
    await client.quit();
  } catch (e) {
    console.error('Error closing Redis connection:', e);
  }
  process.exit(0);
});
