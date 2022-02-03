import { render, screen, fireEvent } from '@testing-library/react';

import { Input } from '@/layouts/core/TextField';

describe('Input', () => {
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

  const getComponent = (newProps = {}) => <Input {...props} {...newProps} />;

  it('Render a Input', () => {
    render(getComponent());

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', props.name);
    expect(input).toHaveAttribute('placeholder', props.placeholder);
    expect(input).not.toBeDisabled();
  });

  it('Verify that the onChange prop works fine', () => {
    const value = 'I\'m a value';

    render(getComponent());

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value } });

    expect(props.formik.handleChange).toHaveBeenCalled();
    expect(input).toHaveValue(value);
  });

  it('Verify that disabled prop works fine', () => {
    render(getComponent({ disabled: true }));

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
  });
});
