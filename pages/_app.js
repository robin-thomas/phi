import { MoralisProvider } from "react-moralis";

import DataProvider from '../components/DataProvider';

import '../globals/styles.css'
import 'simplebar/dist/simplebar.min.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId={process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </MoralisProvider>
  )
}
