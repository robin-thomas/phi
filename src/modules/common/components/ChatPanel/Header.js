import Grid from '@mui/material/Grid';

import styles from './Header.module.css';
import { useAppContext } from '@/modules/common/hooks';

const Header = () => {
  const { profile, activeContactProfile } = useAppContext();

  return (
    <Grid
      container
      spacing={3}
      alignItems='center'
      className={styles.header}
      justifyContent="space-between"
    >
      {profile?.address && (
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
