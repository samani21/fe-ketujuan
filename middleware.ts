import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Ambil subdomain (asumsi: toko.katujuan.net)
  const currentHost = hostname.replace(`.katujuan.net`, '')
  
  // Jika akses root katujuan.net atau app.katujuan.net, lewatkan
  if (currentHost === 'katujuan' || currentHost === 'app' || currentHost === 'api') {
    return NextResponse.next()
  }

  // Kirim subdomain ke request agar bisa dibaca di Server Component/API
  const response = NextResponse.next()
  response.headers.set('x-subdomain', currentHost)
  return response
}