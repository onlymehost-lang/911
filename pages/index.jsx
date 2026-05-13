import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>911 Cyber Emergency — Immediate Expert Incident Response</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Hacked? Scammed? Every second counts. Speak to a cyber incident response specialist in minutes." />
      </Head>
      <iframe
        title="911 Cyber Emergency"
        src="/911cyber-v2-FULL.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
        }}
      />
    </>
  );
}
