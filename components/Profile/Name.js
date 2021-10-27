import { useEffect, useState } from 'react';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import { useAppContext } from '../hooks';
import { updateProfile } from '../../utils/ceramic';

const Name = () => {
  const { profile, setProfile } = useAppContext();

  const [name, setName] = useState(profile?.name || '');
  const [disabled, setDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.name) {
      setName(profile?.name);
    }
  }, [profile]);

  const onChange = (e) => setName(e.target.value);

  const onEdit = () => setDisabled(false);
  const onSubmit = async () => {
    setDisabled(true);
    setSubmitting(true);

    await updateProfile({ name });
    setProfile((_profile) => ({ ..._profile, name }));
    setSubmitting(false);
  }

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel shrink>Your Name</InputLabel>
      <Input
        value={name}
        onChange={onChange}
        disabled={disabled}
        disableUnderline={disabled}
        endAdornment={(
          <InputAdornment position="end">
            {submitting ? (
              <CircularProgress color="secondary" size={25} />
            ) : disabled ? (
              <Tooltip title="Edit" placement="top" arrow>
                <IconButton color="primary" onClick={onEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Save" placement="top" arrow>
                <IconButton color="primary" onClick={onSubmit}>
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            )}
          </InputAdornment>
        )}
      />
    </FormControl>
  )
}

export default Name;
