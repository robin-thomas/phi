import MUICard from '@mui/material/Card';
import MUICardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';

import styles from './index.module.css';

const ContactCard = ({ classes, onClick, ...props }) => {
  classes = classes || { root: styles.card };

  return (
    <MUICard classes={classes} onClick={onClick}>
      <MUICardHeader
        {...props}
        classes={{
          title: styles.title,
          subheader: styles.subheader,
        }}
      />
    </MUICard>
  )
}

ContactCard.propTypes = {
  classes: PropTypes.object,
  onClick: PropTypes.func,
};

export default ContactCard;
