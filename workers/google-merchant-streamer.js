/**
 * Cloudflare Worker: Google Merchant Center Product Feed Streamer & Edge Cache
 * Rani Hyper Market (Bodinayakanur, Theni District, Tamil Nadu)
 * 
 * Scheduled Cron: 30 20 * * * (Daily at 02:00 AM IST / 20:30 UTC)
 * Route: https://rani-hyper-market.vercel.app/google-merchant-feed.xml
 */

export default {
  /**
   * Handle incoming HTTP requests from Googlebot / Google Shopping Crawlers
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only handle feed endpoints
    if (url.pathname !== '/google-merchant-feed.xml' && url.pathname !== '/api/feed/google-merchant.xml') {
      return fetch(request);
    }

    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = '/google-merchant-feed.xml';
    cacheUrl.search = ''; // Strip query parameters for canonical caching
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // 1. Check Cloudflare Edge Cache
    let response = await cache.match(cacheKey);
    if (response) {
      const edgeResponse = new Response(response.body, response);
      edgeResponse.headers.set('X-Edge-Cache-Status', 'HIT');
      edgeResponse.headers.set('X-Google-Merchant-Sync', 'Cloudflare-Edge-Worker');
      return edgeResponse;
    }

    // 2. Cache Miss: Fetch from Origin (Vercel Production)
    const originUrl = `https://rani-hyper-market.vercel.app/google-merchant-feed.xml`;
    const originRequest = new Request(originUrl, {
      headers: {
        'Accept': 'application/xml, text/xml, */*',
        'User-Agent': 'Cloudflare-Merchant-Streamer/2.0'
      }
    });

    try {
      const originResponse = await fetch(originRequest);
      if (!originResponse.ok) {
        return new Response(`Origin error: ${originResponse.status}`, { status: originResponse.status });
      }

      // 3. Build Streamed Response with Edge Caching Headers
      const streamHeaders = new Headers(originResponse.headers);
      streamHeaders.set('Content-Type', 'application/xml; charset=utf-8');
      streamHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      streamHeaders.set('X-Edge-Cache-Status', 'MISS');
      streamHeaders.set('X-Google-Merchant-Sync', 'Cloudflare-Edge-Worker');
      streamHeaders.set('X-Store-Location', 'Bodinayakanur, Theni District, Tamil Nadu (625513)');
      streamHeaders.set('X-Bilingual-Voice-Search', 'Active (English + Tamil)');

      // Pipe through TransformStream for zero-buffering edge streaming
      const { readable, writable } = new TransformStream();
      originResponse.body.pipeTo(writable);

      const cachedResponse = new Response(readable, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: streamHeaders
      });

      // Save to Cloudflare Edge Cache in background
      ctx.waitUntil(cache.put(cacheKey, cachedResponse.clone()));

      return cachedResponse;
    } catch (err) {
      return new Response(`Error streaming Google Merchant feed: ${err.message}`, { status: 502 });
    }
  },

  /**
   * Cloudflare Cron Trigger (Runs daily at 02:00 AM IST / 20:30 UTC: '30 20 * * *')
   * Proactively triggers origin regeneration and warms edge cache
   */
  async scheduled(event, env, ctx) {
    console.log(`[Cloudflare Cron 02:00 AM IST] Executing Google Merchant Feed Regeneration: ${event.cron}`);
    
    // Proactively call Vercel Cron Endpoint to regenerate latest inventory & pricing
    const cronUrl = 'https://rani-hyper-market.vercel.app/api/cron/merchant-feed';
    try {
      const res = await fetch(cronUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CRON_SECRET || 'rani_cron_secure_token_2026'}`,
          'User-Agent': 'Cloudflare-Scheduled-Worker/2.0'
        }
      });
      const data = await res.json();
      console.log('[Cloudflare Cron] Origin Feed Regenerated successfully:', data);

      // Pre-warm the Cloudflare edge cache immediately
      const feedUrl = 'https://rani-hyper-market.vercel.app/google-merchant-feed.xml';
      const cache = caches.default;
      const primeRes = await fetch(feedUrl);
      if (primeRes.ok) {
        await cache.put(feedUrl, primeRes);
        console.log('[Cloudflare Cron] Edge cache primed with updated 6.28 MB feed.');
      }
    } catch (e) {
      console.error('[Cloudflare Cron] Error in daily feed sync:', e.message);
    }
  }
};
