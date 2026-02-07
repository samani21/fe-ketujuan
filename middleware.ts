import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // 1. Pecah Hostname (toko.katujuan.net -> ['toko', 'katujuan', 'net'])
  const hostnameParts = hostname.split('.')
  let subdomain = ''
  
  // Deteksi subdomain (asumsi domain utama memiliki 2 bagian: katujuan.net)
  if (hostnameParts.length >= 3) {
    subdomain = hostnameParts[0].toLowerCase()
  }

  const response = NextResponse.next()

  // --- CASE 1: Platform Hub (app.katujuan.net) ---
  if (subdomain === 'app') {
    // Berikan identitas platform ke backend
    response.headers.set('X-Client-Subdomain', 'app')

    // Izinkan semua akses ke path /auth/* dan welcome screen (/)
    return response
  }

  // --- CASE 2: Admin Platform (admin.katujuan.net) ---
  if (subdomain === 'admin') {
    response.headers.set('X-Client-Subdomain', 'admin')
    return response
  }

  // --- CASE 3: Client Storefront (contoh: pureeats.katujuan.net) ---
  const reserved = ['app', 'admin', 'api', 'monitoring', 's3', 'minio']
  if (subdomain !== '' && !reserved.includes(subdomain)) {
    // Suntikkan subdomain ke header agar backend Lumen bisa scoping data
    response.headers.set('X-Client-Subdomain', subdomain)
    
    // Cegah user mengakses halaman /auth di level subdomain toko 
    // (Opsional: agar login terpusat di app.katujuan.net)
    if (url.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL(`https://app.katujuan.net/auth/login`, request.url))
    }

    return response
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}