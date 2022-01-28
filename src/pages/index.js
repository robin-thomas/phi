import Grid from '@mui/material/Grid';
import Head from 'next/head';

import { PillButton } from '@/layouts/core/Button';
import { ChatPanel, SidePanel } from '@/modules/common/components';
import { useAppContext } from '@/modules/common/hooks';

function Index() {
  const { network } = useAppContext();

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME} | A decentralized, end-to-end encrypted chat engine</title>
      </Head>
      <Grid container sx={{ pt: 2, px: 3 }} justifyContent="space-between">
        <Grid item>
          <PillButton>{process.env.APP_NAME}</PillButton>
        </Grid>
        {network && (
          <Grid item>
            <PillButton>{network}</PillButton>
          </Grid>
        )}
      </Grid>
      <SidePanel />
      <ChatPanel />
    </>
  )
}

export default Index;
