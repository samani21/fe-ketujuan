import React from 'react';
import { GetServerSideProps } from 'next';
import WelcomeScreen from '@/Components/Platform/WelcomeScreen';
import FrontStore from '@/Components/Store/FrontStore';
 

interface HomeProps {
  subdomain: string;
  isPlatform: boolean;
}

export default function Home({ subdomain, isPlatform }: HomeProps) {
  // Jika subdomain adalah 'app' atau kosong (katujuan.net), tampilkan Welcome Screen
  if (isPlatform) {
    return <WelcomeScreen />;
  }

  // Jika selain itu (toko-budi.katujuan.net), tampilkan kodingan asli kamu
  return <FrontStore subdomain={subdomain} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host || '';
  const hostnameParts = host.split('.');
  
  let subdomain = '';
  if (hostnameParts.length >= 3) {
    subdomain = hostnameParts[0].toLowerCase();
  }

  const isPlatform = subdomain === 'app' || subdomain === '' || subdomain === 'katujuan';

  return {
    props: {
      subdomain,
      isPlatform
    },
  };
};