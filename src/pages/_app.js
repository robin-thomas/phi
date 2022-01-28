import { MoralisProvider } from 'react-moralis';
import 'simplebar/dist/simplebar.min.css';

import '@/app/styles/common.css';
import DataProvider from '@/modules/common/components/DataProvider';

export default function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId={process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </MoralisProvider>
  )
}
