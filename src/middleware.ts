// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from './config/appConfig'; // Sesuaikan path-nya

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // 1. Ambil hostname murni (tanpa port :3000)
  const hostname = host.split(':')[0];

  // 2. Ekstrak subdomain berdasarkan appDomain dari config
  let subdomain = hostname
    .replace(appConfig.appDomain, '')
    .replace('www.', '');

  // Bersihkan titik yang tersisa (misal: "dapur-mbm." -> "dapur-mbm")
  subdomain = subdomain.replace(/^\.|\.$/g, "");

  // 3. Abaikan file statis, API internal, dan rute pendaftaran/auth
  const isInternalPage = 
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/auth') || 
    url.pathname.startsWith('/register') ||
    url.pathname === '/favicon.ico';

  if (isInternalPage) return NextResponse.next();

  // 4. Logika Platform vs Tenant
  const isPlatform = subdomain === 'app' || subdomain === '';

  if (isPlatform) {
    // Biarkan request menuju pages/index.tsx (yang akan me-redirect ke /auth)
    return NextResponse.next();
  }

  // 5. REWRITE internal ke folder pages/[client]
  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};