import { render, screen, fireEvent } from '@testing-library/react';

import { TextField } from '@/layouts/core/TextField';

describe('TextField', () => {
  const props = {
    formik: {
      values: {},
      touched: {},
      errors: {},
      handleChange: jest.fn(),
      setFieldTouched: jest.fn(),
    },
    name: 'name',
    placeholder: 'I\'m a placeholder',
  }

  const getComponent = (newProps = {}) => <TextField {...props} {...newProps} />;
  
  it('Render a TextField', () => {
    render(getComponent());

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', props.name);
    expect(input).toHaveAttribute('placeholder', props.placeholder);
    expect(input).not.toBeDisabled();
  });

  it('Verify that the onChange prop works fine', () => {
    const onChange = jest.fn();
    const value = 'I\'m a value';

    render(getComponent({ onChange }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value } });

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue(value);
  });

  it('Verify that disabled prop works fine', () => {
    render(getComponent({ disabled: true }));

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
  });
});
