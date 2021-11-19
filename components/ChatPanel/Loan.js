import { useState, useEffect } from 'react';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import { useAppContext } from '../hooks';

const Loan = () => {
  const { profile, activeContact } = useAppContext();
  const [, setContact] = useState(null);

  useEffect(() => {
    Utils.getInstance(Ceramic)
      .then(ceramic => ceramic.getProfile(activeContact))
      .then(setContact);
  }, [activeContact]);

  return (
    <>
      <h2>Hi, {profile.name}!</h2>
    </>
  )
}

export default Loan;
