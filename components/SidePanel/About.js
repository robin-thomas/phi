import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import styles from './Contacts.module.css';

const About = () => (
  <Box className={styles.nofriendBox}sx={{ px: 5 }}>
    <h1>{process.env.APP_NAME}.</h1>
    <h3>A decentralized, secure, end-to-end encrypted chat engine built on Ethereum blockchain.</h3>
    <Divider sx={{ mb: 4 }}/>
    <h4>You can send chat requests to Ethereum addresses. Once they approve, they become your friends.</h4>
    <h4>You can then share text messages and image attachments securely between your friends.</h4>
  </Box>
);

export default About;
