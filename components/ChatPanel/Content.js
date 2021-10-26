import Image from 'next/image';
import Button from '@mui/material/Button';
import { useMoralis } from "react-moralis";

import styles from './Content.module.css';
import MetamaskLogo from '../../assets/metamask.png';

const Content = () => {
  const { authenticate, isAuthenticated, user } = useMoralis();

  return (
    <div className={styles.content}>
      <div>
        <Image src={MetamaskLogo} width={336} height={450} />
      </div>
      <Button variant="contained" onClick={authenticate}>Connect Wallet</Button>
    </div>
  )
}

export default Content;
