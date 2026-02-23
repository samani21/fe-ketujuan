import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  // Hapus semua experimental dan devIndicators jika tipenya tidak cocok
};

export default nextConfig;