import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import MUITableCell from '@mui/material/TableCell';
import MUITableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

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
  const { threadID, loanIdUpdate, setLoanIdUpdate } = useAppContext();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (loanIdUpdate !== null && loanIdUpdate !== row._id) {
      return;
    }

    setStatus(null);
    getLoan(row._id);
  }, [loanIdUpdate]);

  const getLoan = async (loanId) => {
    const contract = await Utils.getInstance(Contract);
    const loan = await contract.getLoan(loanId);
    setStatus(loan.status);
  }

  const approveLoan = async () => {
    if (window.confirm('Are you sure you want to approve this loan?')) {
      const contract = await Utils.getInstance(Contract);
      const tx = await contract.approvaLoan(row._id, row.amount);
      await tx.wait();
      setLoanIdUpdate(row._id);
    }
  }

  const deleteLoan = async () => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.loan(threadID).delete(row._id);
    }
  }

  const receiveLoan = async () => {
    if (window.confirm('Are you sure you want to receive this loan?')) {
      const contract = await Utils.getInstance(Contract);
      const tx = await contract.receiveLoan(row._id);
      await tx.wait();
      setLoanIdUpdate(row._id);
    }
  }

  const closeLoan = async () => {
    if (window.confirm('Are you sure you want to close this loan?')) {
      const contract = await Utils.getInstance(Contract);
      const tx = await contract.closeLoan(row._id, row.amount);
      await tx.wait();
      setLoanIdUpdate(row._id);
    }
  }

  const getButton = () => {
    if (sent) {
      if ([Contract.STATUS_CREATING, Contract.STATUS_PENDING].includes(status)) {
        return (
          <RowButton color="error" title="Delete this loan request" onClick={deleteLoan}>
            <DeleteOutlineIcon />
          </RowButton>
        )
      } else if (status === Contract.STATUS_APPROVED) {
        return (
          <RowButton color="error" title="Receive loan" onClick={receiveLoan}>
            <LocalAtmIcon />
          </RowButton>
        )
      } else if (status === Contract.STATUS_RECEIVED) {
        return (
          <RowButton color="error" title="Close loan" onClick={closeLoan}>
            <LocalAtmIcon />
          </RowButton>
        )
      }
    } else {
      if (status ===  Contract.STATUS_PENDING) {
        return (
          <RowButton color="error" title="Approve this loan request" onClick={approveLoan}>
            <CheckIcon />
          </RowButton>
        )
      }
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
        {getButton()}
      </MUITableCell>
    </MUITableRow>
  )
}

export default Row;
