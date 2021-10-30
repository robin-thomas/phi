import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

const Search = ({ formik, name, placeholder, onChange, disabled, display }) => (
  <TextField
    name={name}
    placeholder={placeholder}
    value={formik.values[name]}
    onChange={(e) => {
      formik.setFieldTouched(name);
      formik.handleChange(e);
      onChange && onChange();
    }}
    onBlur={formik.handleSubmit}
    disabled={disabled}
    autoComplete='off'
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={formik.touched[name] && formik.errors[name]}
    InputProps={{
      disableUnderline: true,
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          {disabled ? (
            <CircularProgress color="secondary" size={16} />
          ) : formik.touched[name] && !formik.errors[name] && display ? (
            <Tooltip title="Save" placement="top" arrow>
              <IconButton
                color="primary"
                onClick={formik.handleSubmit}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </InputAdornment>
      ),
    }}
    variant="filled"
    fullWidth
  />
)

export default Search;
