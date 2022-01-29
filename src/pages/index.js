import Grid from '@mui/material/Grid';
import Head from 'next/head';

import { APP_NAME, APP_SHORT_DESCRIPTION } from '@/app/config/app';
import { PillButton } from '@/layouts/core/Button';
import { ChatPanel, SidePanel } from '@/modules/common/components';
import { useAppContext } from '@/modules/common/hooks';

function Index() {
  const { network } = useAppContext();

  return (
    <>
      <Head>
        <title>{APP_NAME} | {APP_SHORT_DESCRIPTION}</title>
      </Head>
      <Grid container sx={{ pt: 2, px: 3 }} justifyContent="space-between">
        <Grid item>
          <PillButton>{APP_NAME}</PillButton>
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
