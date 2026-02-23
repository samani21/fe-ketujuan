import React from 'react';
import { GetServerSideProps } from 'next';
import FrontStore from '@/Components/Store/FrontStore';

interface TenantHomeProps {
  client: string;
}

export default function TenantHome({ client }: TenantHomeProps) {
  return <FrontStore subdomain={client} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Ambil 'client' dari params atau query
  // Next.js menyimpan hasil rewrite [client] di dalam context.params atau context.query
  const client = context.params?.client || context.query?.client;

  // LOGIKA VALIDASI PENTING:
  // Jika client tidak ada (misal akses root domain tanpa middleware)
  if (!client || client === 'www' || client === 'app') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      // Pastikan data yang dikirim adalah string bersih
      client: String(client),
    },
  };
};