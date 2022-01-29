import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MUISkeleton from '@mui/material/Skeleton';
import Image from 'next/image';

import ActiveContact from '../../../contact/components/ActiveContact';
import styles from './Content.module.css';
import MetamaskLogo from '@/assets/images/metamask.png';
import { useAppContext } from '@/modules/common/hooks';
import { login } from '@/modules/wallet/utils/onboard';

const Skeleton = () => (
  <>
    <MUISkeleton animation="wave" variant="rectangular" width={150} height={50} sx={{ mt: 4 }}/>
    <MUISkeleton animation="wave" variant="rectangular" width={300} height={40} sx={{ mt: 1 }}/>
  </>
);

const Content = () => {
  const [name, setName] = useState('');

  const { address, setAddress, setProvider, profile, activeContact, setNetwork } = useAppContext();

  const authenticate = async () => {
    const callback = async (provider) => {
      await provider.ready;

      setProvider(provider);

      const network = await provider.getNetwork();
      setNetwork(network?.name || null);

      const signer = provider.getSigner();
      const _address = await signer.getAddress();
      setAddress(_address.toLowerCase());
    }

    await login(callback);
  }

  useEffect(() => profile?.name && setName(profile?.name), [profile]);

  return (
    <div className={styles.content}>
      {!address ? (
        <>
          <div className={styles.metamask}>
            <Image alt="Metamask Wallet login" src={MetamaskLogo} width={336} height={450} />
          </div>
          <div className={styles.metamask}>
            <Button variant="contained" onClick={authenticate}>Connect Wallet</Button>
          </div>
        </>
      ) : (
        <Box sx={{ ml: 20, pt: '80px', height: '100%' }} className={styles.box}>
          {!name ? (
            <Skeleton />
          ) : !activeContact ? (
            <>
              <h2>Hi, {name}!</h2>
              <h4 style={{ marginTop: '-15px' }}>Get started by messaging a friend.</h4>
            </>
          ) : (
            <ActiveContact />
          )}
        </Box>
      )}
    </div>
  )
}

export default Content;
