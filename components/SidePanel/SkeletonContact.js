import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';

import styles from './Header.module.css';

const SkeletonContact = () => (
  <Card classes={{ root: styles.card }}>
    <CardHeader
      avatar={<Skeleton variant="circular" animation="wave" className={styles.avatar} />}
      title={(
        <Skeleton
          animation="wave"
          height={10}
          width="80%"
          style={{ marginBottom: 6 }}
          sx={{ bgcolor: "#c57e9e" }}
        />
      )}
      subheader={(
        <Skeleton animation="wave" height={10} width="40%" sx={{ bgcolor: "#c57e9e" }} />
      )}
      classes={{
        title: styles.title,
        subheader: styles.subheader,
      }}
    />
  </Card>
);

export default SkeletonContact;
