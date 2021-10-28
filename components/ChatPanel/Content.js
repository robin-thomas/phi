import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MUISkeleton from '@mui/material/Skeleton';
import { useMoralis } from 'react-moralis';

import styles from './Content.module.css';
import { useAppContext } from '../hooks';
import MetamaskLogo from '../../assets/metamask.png';

const Skeleton = () => (
  <>
    <MUISkeleton animation="wave" variant="rectangular" width={150} height={50} sx={{ mt: 4 }}/>
    <MUISkeleton animation="wave" variant="rectangular" width={300} height={40} sx={{ mt: 1 }}/>
  </>
)

const Content = () => {
  const [name, setName] = useState('');
  const { profile } = useAppContext();
  const { authenticate, isAuthenticated, user } = useMoralis();

  useEffect(() => {
    if (profile?.name) {
      setName(profile?.name);
    }
  }, [profile])

  return (
    <div className={styles.content}>
      {!isAuthenticated ? (
        <>
          <div className={styles.metamask}>
            <Image alt="Metamask Wallet login" src={MetamaskLogo} width={336} height={450} />
          </div>
          <div className={styles.metamask}>
            <Button variant="contained" onClick={authenticate}>Connect Wallet</Button>
          </div>
        </>
      ) : (
        <Box sx={{ ml: 20, pt: 10 }} className={styles.box}>
          {!name ? (
            <Skeleton />
          ) : (
            <>
              <h2>Hi, {name}!</h2>
              <h4 style={{ marginTop: '-15px' }}>Get started by messaging a friend.</h4>
            </>
          )}
        </Box>
      )}
    </div>
  )
}

export default Content;
