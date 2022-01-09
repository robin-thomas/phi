import Grid from '@mui/material/Grid';

import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Header = () => {
  const { authenticated, activeContactProfile } = useAppContext();

  return (
    <Grid
      container
      spacing={3}
      alignItems='center'
      className={styles.header}
      justifyContent="space-between"
    >
      {authenticated && (
        <Grid item xs="auto" sx={{ ml: 18 }}>
          {activeContactProfile?.name && (
            <span className={styles.appName}>{activeContactProfile?.name}</span>
          )}
        </Grid>
      )}
    </Grid>
  )
}

export default Header;
