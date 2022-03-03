import Box from '@mui/material/Box';
import MUISkeleton from '@mui/material/Skeleton';
import Image from 'next/image';

import styles from './Content.module.css';
import MetamaskLogo from '@/assets/images/metamask.png';
import { useAppContext } from '@/modules/common/hooks';
import { ActiveContact } from '@/modules/contact/components';
import { Login } from '@/modules/wallet/components';

const Skeleton = () => (
  <>
    <MUISkeleton animation="wave" variant="rectangular" width={150} height={50} sx={{ mt: 4 }}/>
    <MUISkeleton animation="wave" variant="rectangular" width={300} height={40} sx={{ mt: 1 }}/>
  </>
);

const Content = () => {
  const { profile, activeContact } = useAppContext();

  return (
    <div className={styles.content}>
      {!profile?.address ? (
        <>
          <div className={styles.metamask}>
            <Image alt="Metamask Wallet login" src={MetamaskLogo} width={336} height={450} />
          </div>
          <div className={styles.metamask}>
            <Login />
          </div>
        </>
      ) : (
        <Box sx={{ ml: 20, pt: '80px', height: '100%' }} className={styles.box}>
          {!profile?.name ? (
            <Skeleton />
          ) : !activeContact ? (
            <>
              <h2>Hi, {profile?.name}!</h2>
              <h4 style={{ marginTop: '-15px' }}>Get started by messaging a friend.</h4>
            </>
          ) : (
            <ActiveContact />
          )}
        </Box>
      )}
    </div>
  );
}

export default Content;
