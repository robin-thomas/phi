import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Drawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Avatar from '../Profile/Avatar';
import Settings from './Settings';

import { useAppContext } from '../hooks';
import styles from './Header.module.css';

const Header = ({ openDrawer }) => {
  const { profile } = useAppContext();
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card
      style={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
      sx={{ px: 3, pt: 2 }}
    >
      <CardHeader
        avatar={<Avatar mini={true} />}
        action={
          !profile?.name ? null : (
            <Settings />
          )
        }
        title={
          !profile?.name ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
              sx={{ bgcolor: "#c57e9e" }}
            />
          ) : profile?.name
        }
        subheader={
          !profile?.description ? (
            <Skeleton animation="wave" height={10} width="40%" sx={{ bgcolor: "#c57e9e" }} />
          ) : (
            profile.description
          )
        }
        classes={{
          title: styles.title,
          subheader: styles.subheader,
        }}
      />
    </Card>
  )
}

export default Header;
