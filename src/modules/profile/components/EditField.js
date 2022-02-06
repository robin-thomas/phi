import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import * as yup from 'yup';

import { updateProfile } from '../utils/ceramic';
import { IconButton } from '@/layouts/core/Button';
import { Input } from '@/layouts/core/TextField';
import { useAppContext } from '@/modules/common/hooks';

const EditField = ({ name, label }) => {
  const { address, profile, setProfile } = useAppContext();

  const [disabled, setDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      [name]: profile[name] || '',
    },
    validationSchema: yup.object({
      [name]: yup.string().required(`${label} is required`),
    }),
    onSubmit: async (values) => {
      setDisabled(true);

      // if there is a change.
      if (values[name] !== formik.initialValues[name]) {
        setSubmitting(true);

        const _profile = await updateProfile(address, name, values[name]);
        setProfile((_profile));

        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Input
      formik={formik}
      name={name}
      label={label}
      onBlur={formik.handleSubmit}
      disabled={disabled}
      endAdornment={(
        <InputAdornment position="end">
          {submitting ? (
            <CircularProgress color="secondary" size={25} />
          ) : disabled ? (
            <IconButton title="Edit" onClick={() => setDisabled(false)}>
              <EditIcon />
            </IconButton>
          ) : !(formik.touched[name] && formik.errors[name]) && (
            <IconButton title="Save" onClick={formik.handleSubmit}>
              <CheckIcon />
            </IconButton>
          )}
        </InputAdornment>
      )}
    />
  )
}

EditField.propTypes = {
  name: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
};

export default EditField;
