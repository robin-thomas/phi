import MUITable from '@mui/material/Table';
import MUITableBody from '@mui/material/TableBody';
import MUITableCell from '@mui/material/TableCell';
import MUITableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SimpleBar from 'simplebar-react';

import Utils from '../../../utils';
import Thread from '../../../utils/textile/thread';
import { useAppContext } from '../../hooks';

const Table = ({ rows }) => {
  const { threadID } = useAppContext();

  const deleteLoan = (id) => async () => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.loan(threadID).delete(id);
    }
  }

  return (
    <SimpleBar style={{ height: '250px', marginBottom: '25px' }}>
      <MUITable>
        <MUITableBody>
          {rows.map((row) => (
            <MUITableRow key={row._id}>
              <MUITableCell>${row.amount}</MUITableCell>
              <MUITableCell>{row.months} month(s)</MUITableCell>
              <MUITableCell>{row.date.substr(0,10)}</MUITableCell>
              <MUITableCell>
                <Tooltip arrow title="Delete this loan request">
                  <IconButton color="error" onClick={deleteLoan(row._id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </MUITableCell>
            </MUITableRow>
          ))}
        </MUITableBody>
      </MUITable>
    </SimpleBar>
  )
};

export default Table;
