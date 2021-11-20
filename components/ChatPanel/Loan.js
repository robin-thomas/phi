import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FormHelperText from '@mui/material/FormHelperText';

import { useAppContext } from '../hooks';
import Utils from '../../utils';
import Thread from '../../utils/textile/thread';

const Loan = () => {
  const { threadID, activeContact, activeContactProfile } = useAppContext();

  const months = [...Array(12).keys()].map(i => i + 1);

  useEffect(() => {
    (async () => {
      if (threadID) {
        const thread = await Utils.getInstance(Thread);
        const loans = await thread.loan(threadID).getAll();

        // TODO.
      }
    })();
  }, [threadID]);

  const formik = useFormik({
    initialValues: { amount: '', tenure: '' },
    validationSchema: yup.object({
      amount: yup.string().matches(/^[1-9][0-9]{2}$/, 'Amount should be $1-999').required('Required field'),
      tenure: yup.string().required('Required field'),
    }),
    onSubmit: async (values) => {
      if (window.confirm('Are you sure?')) {
        const thread = await Utils.getInstance(Thread);
        await thread.loan(threadID).post({
          to: activeContact,
          amount: parseInt(values.amount),
          months: values.tenure,
        });
      }
    },
    enableReinitialize: true,
  });

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs="auto">
          <Button
            color="info"
            variant="contained"
            sx={{ fontWeight:900 }}
            onClick={formik.handleSubmit}
            disabled={Object.keys(formik.touched).length === 0 || Object.keys(formik.errors).length > 0}
          >
            Request
          </Button>
        </Grid>
        <Grid item xs="auto">
          <FormControl sx={{ maxWidth: 100 }}>
            <TextField
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              placeholder="10"
              variant="standard"
              sx={{ input: { fontWeight: 900 , fontSize: 22 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 5,
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs="auto">
          <h4>loan for</h4>
        </Grid>
        <Grid item xs="2" sx={{ mt: -2 }}>
          <FormControl fullWidth variant="standard" error={formik.touched.tenure && Boolean(formik.errors.tenure)}>
            <InputLabel sx={{ fontWeight:900 }}>months</InputLabel>
            <Select
              name="tenure"
              value={formik.values.tenure}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{ fontWeight: 900 , fontSize: 22 }}
            >
              {months.map(month => <MenuItem key={month} value={month}>{month}</MenuItem>)}
            </Select>
            <FormHelperText>{formik.touched.tenure && formik.errors.tenure}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs="auto">
          <h4>from {activeContactProfile.name}</h4>
        </Grid>
      </Grid>
      <h3>Loan Requests</h3>
    </>
  )
}

export default Loan;
