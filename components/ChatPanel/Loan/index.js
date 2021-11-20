import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';

import Tabs from './Tabs';
import Loan from './Loan';

import { useAppContext } from '../../hooks';
import Utils from '../../../utils';
import Thread from '../../../utils/textile/thread';

const Index = () => {
  const { threadID } = useAppContext();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    (async () => {
      if (threadID) {
        const thread = await Utils.getInstance(Thread);
        const _loans = await thread.loan(threadID).getAll();
        setLoans(_loans);
      }
    })();
  }, [threadID]);

  useEffect(() => {
    (async () => {
      if (threadID) {
        const thread = await Utils.getInstance(Thread);
        return thread.listen(callback, threadID);
      }
    })();
  }, [threadID, callback]);

  const callback = useCallback(async (reply, err) => {
    const thread = await Utils.getInstance(Thread);
    const response = await thread.loan(threadID).listen(reply, err);

    if (response?.from) {
      setLoans(_loans => [..._loans, response]);
    }
  }, [threadID]);

  return (
    <>
      <Box sx={{ mt: -10 }}>
        <h4>Loan Requests</h4>
        <Tabs loans={loans} />
      </Box>
      <Loan />
    </>
  )
}

export default Index;
