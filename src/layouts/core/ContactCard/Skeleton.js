import MUICard from '@mui/material/Card';
import MUICardHeader from '@mui/material/CardHeader';
import MUISkeleton from '@mui/material/Skeleton';
import MUIStack from '@mui/material/Stack';

import styles from './index.module.css';

const Skeleton = () => (
  <MUICard classes={{ root: styles.card }}>
    <MUICardHeader
      avatar={<MUISkeleton variant="circular" animation="wave" className={styles.avatar} />}
      title={(
        <MUISkeleton
          animation="wave"
          height={10}
          width="80%"
          style={{ marginBottom: 6 }}
          sx={{ bgcolor: "#c57e9e" }}
        />
      )}
      subheader={(
        <MUISkeleton animation="wave" height={10} width="40%" sx={{ bgcolor: "#c57e9e" }} />
      )}
    />
  </MUICard>
);

const Skeletons = ({ count }) => {
  const rows = new Array(count || 1).fill(0);

  return (
    <MUIStack>
      {rows.map((_, index) => <Skeleton key={index} />)}
    </MUIStack>
  );
}

export default Skeletons;
