import MUITextField from '@mui/material/TextField';

const TextField = ({ formik, name, placeholder, onBlur, onChange, onKeyDown, sx, disabled, InputProps }) => (
  <MUITextField
    name={name}
    sx={sx}
    placeholder={placeholder}
    value={formik.values[name]}
    onChange={(e) => {
      formik.setFieldTouched(name);
      formik.handleChange(e);
      onChange && onChange();
    }}
    onBlur={onBlur || formik.handleBlur}
    onKeyDown={onKeyDown}
    disabled={disabled}
    autoComplete='off'
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={formik.touched[name] && formik.errors[name]}
    InputProps={{
      disableUnderline: true,
      ...InputProps,
    }}
    variant="filled"
    fullWidth
  />
);

export default TextField;
