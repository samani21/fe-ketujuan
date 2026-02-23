import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from './config/appConfig';

// src/middleware.ts
// src/middleware.ts
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  const parts = hostname.split('.');
  let subdomain = '';

  // Logika subdomain Anda sudah benar
  if (hostname.endsWith('.localhost') || hostname.includes('localhost')) {
    subdomain = parts[0];
  } else {
    subdomain = parts.length > 2 ? parts[0] : '';
  }

  // PERBAIKAN: Jangan pakai .includes('.') secara umum
  const isPublicFile = /\.(.*)$/.test(url.pathname); // Cek apakah ada ekstensi file (misal .png, .jpg)
  const isNextInternal = url.pathname.startsWith('/_next');

  if (isPublicFile || isNextInternal || subdomain === 'app' || subdomain === 'www' || subdomain === '') {
    return NextResponse.next();
  }

  const cleanPathname = url.pathname === '/' ? '' : url.pathname;

  // Gunakan cara ini agar rewrite terbaca sebagai rute internal
  url.pathname = `/${subdomain}${cleanPathname}`;

  console.log("REWRITING TO:", url.pathname);
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