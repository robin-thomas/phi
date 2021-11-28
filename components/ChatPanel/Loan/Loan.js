import { useState } from 'react';
import { useFormik } from 'formik';
import { useMoralis } from 'react-moralis';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Image from 'next/image';

import { useAppContext } from '../../hooks';
import styles from './Loan.module.css';
import Utils from '../../../utils';
import Contract from '../../../utils/contract';
import Thread from '../../../utils/textile/thread';
import logo from '../../../assets/polygon.png';

const Loan = () => {
  const { user } = useMoralis();
  const [disabled, setDisabled] = useState(false);
  const { threadID, activeContact, activeContactProfile } = useAppContext();

  const months = [...Array(12).keys()].map(i => i + 1);

  const formik = useFormik({
    initialValues: { amount: '', tenure: '' },
    validationSchema: yup.object({
      amount: yup.number().positive().required('Required field'),
      tenure: yup.string().required('Required field'),
    }),
    onSubmit: async (values) => {
      if (window.confirm('Are you sure?')) {
        const amount = parseFloat(values.amount).toFixed(2);

        setDisabled(true);

        try {
          const thread = await Utils.getInstance(Thread);
          const [id] = await thread.loan(threadID, user.get('ethAddress')).post({
            to: activeContact,
            amount: parseFloat(amount),
            months: values.tenure,
          });

          const contract = await Utils.getInstance(Contract);
          await contract.createLoan({
            loanId: id,
            from: activeContact,
            to: user.get('ethAddress'),
            amount: parseFloat(amount),
            months: values.tenure,
          }, threadID);
        } catch (err) {
          console.error(err);
        }

        setDisabled(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Grid container alignItems="center" justifyContent="space-between" className={styles.box} sx={{ px: 5 }}>
      <Grid item xs="auto">
        <Button
          color="info"
          variant="contained"
          sx={{ fontWeight:900 }}
          onClick={formik.handleSubmit}
          disabled={disabled || Object.keys(formik.touched).length === 0 || Object.keys(formik.errors).length > 0}
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
            disabled={disabled}
            placeholder="10"
            variant="standard"
            sx={{ input: { fontWeight: 900 , fontSize: 20 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image src={logo} width={40} height={40} alt="" />
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
        <h5>loan for</h5>
      </Grid>
      <Grid item xs={2} sx={{ mt: -2 }}>
        <FormControl fullWidth variant="standard" error={formik.touched.tenure && Boolean(formik.errors.tenure)}>
          <InputLabel sx={{ fontWeight:900, fontSize: 20 }}>months</InputLabel>
          <Select
            name="tenure"
            value={formik.values.tenure}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ fontWeight: 900 , fontSize: 20 }}
            disabled={disabled}
          >
            {months.map(month => <MenuItem key={month} value={month}>{month}</MenuItem>)}
          </Select>
          <FormHelperText>{formik.touched.tenure && formik.errors.tenure}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs="auto">
        <h5>from {activeContactProfile.name}</h5>
      </Grid>
    </Grid>
  )
}
export default Loan;
