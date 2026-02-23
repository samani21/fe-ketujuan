import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from './config/appConfig';

// src/middleware.ts
export function middleware(request: NextRequest) {
  console.log("--- MIDDLEWARE EXECUTED ---");
  console.log("FULL URL:", request.url);
  console.log("HOSTNAME:", request.headers.get('host'));
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // 1. Ekstrak subdomain dengan memisahkan titik
  // Ganti logika ekstraksi subdomain yang lama dengan ini:
  const parts = hostname.split('.');
  let subdomain = '';

  if (hostname.endsWith('.localhost')) {
    // Local: kedai-kopi.localhost -> ["kedai-kopi", "localhost"]
    subdomain = parts[0];
  } else {
    // Production: kedai-kopi.katujuan.net -> ["kedai-kopi", "katujuan", "net"]
    // Kita ambil "kedai-kopi" hanya jika ada subdomain (lebih dari 2 bagian)
    subdomain = parts.length > 2 ? parts[0] : '';
  }

  // 2. Abaikan internal & platform utama
  const isInternalPage =
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') ||
    url.pathname === '/favicon.ico';

  if (isInternalPage || subdomain === 'app' || subdomain === 'www' || subdomain === '') {
    return NextResponse.next();
  }

  // 3. REWRITE ke /[subdomain][pathname]
  // Pastikan tidak ada double slash jika pathname adalah "/"
  const cleanPathname = url.pathname === '/' ? '' : url.pathname;
  url.pathname = `/${subdomain}${cleanPathname}`;

  console.log("REWRITE SUCCESS TO:", url.pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua rute kecuali:
     * api, _next/static, _next/image, favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};