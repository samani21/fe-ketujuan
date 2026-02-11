import React from 'react';
import { GetServerSideProps } from 'next';
import FrontStore from '@/Components/Store/FrontStore';

interface TenantHomeProps {
  client: string;
}

export default function TenantHome({ client }: TenantHomeProps) {
  // Client di sini adalah subdomain yang ditangkap (misal: 'dapur-mbm')
  return <FrontStore subdomain={client} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { client } = context.query;

  // Di sini kamu bisa melakukan validasi ke API: Apakah client ini aktif?
  // Jika tidak, kamu bisa return { notFound: true } untuk lari ke 404.tsx

  return {
    props: {
      client,
    },
  };
};