import 'simplebar/dist/simplebar.min.css';

import '@/app/styles/common.css';
import DataProvider from '@/modules/common/components/DataProvider';

export default function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  )
}
