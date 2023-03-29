import Head from 'next/head';
import { Poppins } from 'next/font/google';

const inter = Poppins({ weight: '400', subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>Home</main>
    </>
  );
}
