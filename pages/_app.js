import { MoralisProvider } from "react-moralis";

import '../globals/styles.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId={process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>
      <Component {...pageProps} />
    </MoralisProvider>
  )
}
