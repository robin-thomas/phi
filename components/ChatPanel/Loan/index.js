import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import Tabs from './Tabs';
import Loan from './Loan';

import { useAppContext } from '../../hooks';
import Utils from '../../../utils';
import Thread from '../../../utils/textile/thread';

const Index = () => {
  const { threadID, setLoanIdUpdate } = useAppContext();
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
    const createHandler = (response) => {
      if (response?.from) {
        setLoans(_loans => [..._loans, response]);
      }
    };

    const updateHandler = (id) => {
      setLoanIdUpdate(undefined);
      setTimeout(() => setLoanIdUpdate(id), 1500);
    }

    const deleteHandler = (id) => setLoans(_loans => _loans.filter(e => e._id !== id));

    (async () => {
      if (threadID) {
        const thread = await Utils.getInstance(Thread);

        const [createClose, updateClose, deleteClose] = await Promise.all([
          thread.loan(threadID).listen(createHandler, 'CREATE'),
          thread.loan(threadID).listen(updateHandler, 'UPDATE'),
          thread.loan(threadID).listen(deleteHandler, 'DELETE'),
        ]);

        return () => {
          createClose();
          updateClose();
          deleteClose();
        }
      }
    })();
  }, [threadID, setLoanIdUpdate]);

  return (
    <>
      <Box sx={{ mt: -8 }}>
        <Tabs loans={loans} />
      </Box>
      <Loan />
    </>
  )
}

export default Index;