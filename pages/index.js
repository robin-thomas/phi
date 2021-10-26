import Head from 'next/head';

import SidePanel from '../components/SidePanel';
import ChatPanel from '../components/ChatPanel';

function Index() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet" />
      </Head>
      <SidePanel />
      <ChatPanel />
    </>
  )
}

export default Index;
