import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from './config/appConfig';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // 1. Abaikan file statis, API, dan rute internal
  // Menghindari rewrite jika path memiliki ekstensi file (misal: .png, .json)
  const isInternalPage =
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/register') ||
    url.pathname.includes('.') ||
    url.pathname === '/favicon.ico';

  if (isInternalPage) return NextResponse.next();

  // 2. Ekstrak subdomain secara bersih
  let subdomain = '';
  if (hostname.endsWith('.localhost')) {
    subdomain = hostname.replace('.localhost', '');
  } else {
    // Menghapus domain utama untuk mendapatkan subdomain (kedai-kopi.katujuan.net -> kedai-kopi)
    subdomain = hostname.replace(`.${appConfig.appDomain}`, '');
  }

  // Jika subdomain adalah 'app', 'www', atau sama dengan hostname (tidak ada subdomain)
  const isPlatform = subdomain === 'app' || subdomain === 'www' || subdomain === hostname || subdomain === '';

  if (isPlatform) {
    return NextResponse.next();
  }

  // 3. REWRITE internal ke folder pages/[client]
  // Hilangkan trailing slash dari pathname jika itu adalah root "/"
  const cleanPathname = url.pathname === '/' ? '' : url.pathname;

  // Hasil akhirnya: /kedai-kopi (jika akses root) atau /kedai-kopi/login
  url.pathname = `/${subdomain}${cleanPathname}`;

  console.log("SUBDOMAIN TERDETEKSI:", `"${subdomain}"`);
  console.log("PATH TUJUAN REWRITE:", url.pathname);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};