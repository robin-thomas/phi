import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Header = () => {
  const { activeContact } = useAppContext();
  const [name, setName] = useState('');

  useEffect(() => {
    if (activeContact) {
      (async () => {
        const ceramic = await Utils.getInstance(Ceramic);
        const profile = await ceramic.getProfile(activeContact);
        setName(profile?.name);
      })();
    } else {
      setName('');
    }
  }, [activeContact]);

  return (
    <Grid
      container
      spacing={3}
      alignItems='center'
      className={styles.header}
    >
      <Grid item xs="auto" sx={{ ml: 18 }}>
        <span className={styles.appName}>{name}</span>
      </Grid>
    </Grid>
  )
}

export default Header;
