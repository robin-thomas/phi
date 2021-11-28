import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import Button from '@mui/material/Button';
import MUITableCell from '@mui/material/TableCell';
import MUITableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import format from 'date-fns/format';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CreateIcon from '@mui/icons-material/Create';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import CancelIcon from '@mui/icons-material/Cancel';

import Utils from '../../../utils';
import Contract from '../../../utils/contract';
import Thread from '../../../utils/textile/thread';
import { useAppContext } from '../../hooks';
import styles from './Row.module.css';
import logo from '../../../assets/polygon.png';

const RowButton = ({ title, onClick, color, children }) => (
  <Tooltip arrow title={title}>
    <IconButton color={color} onClick={onClick}>
      {children}
    </IconButton>
  </Tooltip>
)

const Row = ({ row, sent }) => {
  const { user } = useMoralis();
  const { threadID, loanIdUpdate } = useAppContext();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (loanIdUpdate !== null && loanIdUpdate !== row._id) {
      return;
    }

    setStatus(null);
    getLoan(row._id);
  }, [loanIdUpdate, row._id]);

  const getLoan = async (loanId) => {
    const contract = await Utils.getInstance(Contract);
    const loan = await contract.getLoan(loanId);
    setStatus(loan.status);
  }

  const approveLoan = async () => {
    if (window.confirm('Are you sure you want to approve this loan?')) {
      const contract = await Utils.getInstance(Contract);
      await contract.approvaLoan(row._id, row.amount);
    }
  }

  const deleteLoan = async () => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.loan(threadID, user.get('ethAddress')).delete(row._id);
    }
  }

  const receiveLoan = async () => {
    if (window.confirm('Are you sure you want to receive this loan?')) {
      const contract = await Utils.getInstance(Contract);
      await contract.receiveLoan(row._id);
    }
  }

  const closeLoan = async () => {
    if (window.confirm('Are you sure you want to close this loan?')) {
      const contract = await Utils.getInstance(Contract);
      await contract.closeLoan(row._id, row.amount);
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
            <CancelIcon />
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

  const getStatusButton = () => {
    let color = 'primary';
    let icon = <CreateIcon />

    switch (status) {
      case Contract.STATUS_PENDING:
        color = 'secondary';
        icon = <PendingIcon />;
        break;

      case Contract.STATUS_APPROVED:
        color = 'success';
        icon = <CheckBoxIcon />
        break;

      case Contract.STATUS_RECEIVED:
        color = 'warning';
        icon = <CallReceivedIcon />;
        break;

      case Contract.STATUS_CLOSED:
        color = 'error';
        icon = <CloseIcon />;
        break;
    }

    return (
      <Button
        className={styles.button}
        size="small"
        variant="contained"
        color={color}
        startIcon={icon}
      >
        {status.toLowerCase()}
      </Button>
    )
  }

  return (
    <MUITableRow>
      <MUITableCell>
        <Image src={logo} width={30} height={30} alt="" />
      </MUITableCell>
      <MUITableCell>{row.amount}</MUITableCell>
      <MUITableCell>
        {status === null ? (
          <CircularProgress size={25} />
        ) : getStatusButton()}
      </MUITableCell>
      <MUITableCell>{row.months} month(s)</MUITableCell>
      <MUITableCell>{format(new Date(row.created), 'MMM d HH:mm aaa')}</MUITableCell>
      <MUITableCell>
        {getButton()}
      </MUITableCell>
    </MUITableRow>
  )
}

export default Row;
