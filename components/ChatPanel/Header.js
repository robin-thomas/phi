import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircleIcon from '@mui/icons-material/Circle';

import styles from './Header.module.css';

const Circle = () => (
  <Grid item>
    <CircleIcon style={{ fill: "grey" }}/>
  </Grid>
)

const Header = () => (
  <Grid
    container
    spacing={3}
    alignItems='center'
    justifyContent="center"
    className={styles.header}
  >
    <Grid item xs="auto" sx={{ pr: 2 }}>
      <span className={styles.appName}>{process.env.APP_NAME}</span>
    </Grid>
    <Circle />
    <Circle />
    <Circle />
    <Grid item xs={6} />
  </Grid>
)

export default Header;
