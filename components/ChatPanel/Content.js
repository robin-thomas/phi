import Box from '@mui/material/Box';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useMoralis } from 'react-moralis';

import styles from './Content.module.css';
import MetamaskLogo from '../../assets/metamask.png';

const Content = () => {
  const { authenticate, isAuthenticated, user } = useMoralis();

  return (
    <div className={styles.content}>
      {!isAuthenticated ? (
        <>
          <div className={styles.metamask}>
            <Image src={MetamaskLogo} width={336} height={450} />
          </div>
          <div className={styles.metamask}>
            <Button variant="contained" onClick={authenticate}>Connect Wallet</Button>
          </div>
        </>
      ) : (
        <Box sx={{ ml: 20, pt: 10 }} className={styles.box}>
          <h2>Hi, Robin!</h2>
          <h4 style={{ marginTop: '-15px' }}>Get started by messaging a friend</h4>
        </Box>
      )}
    </div>
  )
}

export default Content;
