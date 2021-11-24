import MUITable from '@mui/material/Table';
import MUITableBody from '@mui/material/TableBody';
import SimpleBar from 'simplebar-react';

import Row from './Row';
import styles from './Table.module.css';

const Table = ({ rows, sent }) => (
  <SimpleBar style={{ height: '275px', marginBottom: '25px'}}>
    <MUITable className={styles.table}>
      <MUITableBody>
        {rows.map((row) => (
          <Row key={row._id} row={row} sent={sent} />
        ))}
      </MUITableBody>
    </MUITable>
  </SimpleBar>
)

export default Table;
