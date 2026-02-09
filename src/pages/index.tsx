import { GetServerSideProps } from 'next';

/**
 * Halaman ini hanya diakses oleh domain utama (app.katujuan.net / localhost:3000)
 * Karena landing page di repo lain, tugas file ini hanya melempar user ke pintu masuk.
 */
export default function Home() {
  // Secara teknis tidak akan pernah render karena redirect di server-side
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/auth/login', // Mengarahkan ke halaman login/register kamu
      permanent: false,
    },
  };
};