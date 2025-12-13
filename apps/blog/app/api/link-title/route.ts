import { NextResponse } from 'next/server';

function isSafeHttpUrl(input: string) {
  try {
    const url = new URL(input);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname) return null;

    // SSRF 최소 방어: localhost/loopback 차단 (DNS resolve까지는 하지 않음)
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1') return null;
    if (host.endsWith('.local')) return null;

    return url;
  } catch {
    return null;
  }
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function extractTitleFromHtml(html: string) {
  // og:title 우선
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (og?.[1]) return decodeHtmlEntities(og[1].trim());

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title?.[1]) return decodeHtmlEntities(title[1].replace(/\s+/g, ' ').trim());

  return null;
}

function fallbackTitle(url: URL) {
  const path = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '';
  return `${url.hostname}${path}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ title: null }, { status: 400 });
  }

  const url = isSafeHttpUrl(raw);
  if (!url) {
    return NextResponse.json({ title: null }, { status: 400 });
  }

  try {
    const res = await fetch(url.toString(), {
      redirect: 'follow',
      headers: {
        // 일부 사이트가 UA 없으면 차단하는 케이스 대응
        'user-agent': 'interactive-blog/footnote-title (+https://example.invalid)',
        accept: 'text/html,application/xhtml+xml',
      },
      // Next fetch cache
      next: { revalidate: 60 * 60 * 24 * 7 },
    });

    const contentType = res.headers.get('content-type') ?? '';
    if (!res.ok || !contentType.toLowerCase().includes('text/html')) {
      return NextResponse.json({ title: fallbackTitle(url) });
    }

    // 너무 큰 문서는 비용이 큼 → 적당히 컷 (대부분 title은 초반에 있음)
    const html = (await res.text()).slice(0, 200_000);
    const title = extractTitleFromHtml(html) ?? fallbackTitle(url);

    return NextResponse.json({ title });
  } catch {
    return NextResponse.json({ title: fallbackTitle(url) });
  }
}


