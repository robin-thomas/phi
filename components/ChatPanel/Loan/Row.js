import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import MUITableCell from '@mui/material/TableCell';
import MUITableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';

import Utils from '../../../utils';
import Contract from '../../../utils/contract';
import Thread from '../../../utils/textile/thread';
import { useAppContext } from '../../hooks';

const RowButton = ({ title, onClick, color, children }) => (
  <Tooltip arrow title={title}>
    <IconButton color={color} onClick={onClick}>
      {children}
    </IconButton>
  </Tooltip>
)

const Row = ({ row, sent }) => {
  const { threadID } = useAppContext();
  const [status, setStatus] = useState(null);

  useEffect(() => getLoan(row._id), []);

  const getLoan = async (loanId) => {
    const contract = await Utils.getInstance(Contract);
    const loan = await contract.getLoan(loanId);

    console.log('get loan', loan, loanId);

    if (!loan) {
      setStatus('CREATING');
    } else {
      // TODO. verify status.
      setStatus('PENDING');
    }
  }

  const approveLoan = async () => {
    if (window.confirm('Are you sure you want to approve this loan?')) {
      const contract = await Utils.getInstance(Contract);
      await contract.approveLoan(row._id, row.to);
    }
  }

  const deleteLoan = async () => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.loan(threadID).delete(row._id);
    }
  }

  return (
    <MUITableRow>
      <MUITableCell>${row.amount}</MUITableCell>
      <MUITableCell>{row.months} month(s)</MUITableCell>
      <MUITableCell>
        {status === null ? (
          <CircularProgress size={25} />
        ) : (
          <Chip color="primary" label={status} />
        )}
      </MUITableCell>
      <MUITableCell>{row.date.substr(0,10)}</MUITableCell>
      <MUITableCell>
        {sent ? (
          <RowButton color="error" title="Delete this loan request" onClick={deleteLoan}>
            <DeleteOutlineIcon />
          </RowButton>
        ) : status === 'PENDING' && (
          <RowButton color="error" title="Approve this loan request" onClick={approveLoan}>
            <CheckIcon />
          </RowButton>
        )}
      </MUITableCell>
    </MUITableRow>
  )
}

export default Row;
