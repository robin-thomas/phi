import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import EditField from '@/modules/profile/components/EditField';

const address = '0x0000000000000000000000000000000000000000';
const mockUpdateProfile = jest.fn();
const mockSetProfile = jest.fn();

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ profile: { address }, setProfile: mockSetProfile })),
}));

jest.mock('@/modules/profile/utils/ceramic', () => ({
  __esModule: true,
  updateProfile: jest.fn((...args) => mockUpdateProfile(...args)),
}));

describe('Profile', () => {
  const name = 'name';
  const label = 'label';
  const value = 'value';

  it('Verify that name & label props are required', () => {
    expect(() => render(<EditField />)).toThrowError();
    expect(() => render(<EditField name={name} />)).toThrowError();
    expect(() => render(<EditField label={label} />)).toThrowError();
  });

  it('Verify that EditField component can be rendered', async () => {
    render(<EditField name={name} label={label} />);

    const editField = screen.getByRole('textbox');
    expect(editField).toBeInTheDocument();

    fireEvent.change(editField, { target: { value} });
    fireEvent.blur(editField);

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith(address, name, value));
  });

  it('Verify that the validation errors are caught properly', async () => {
    render(<EditField name={name} label={label} />);

    const error = `${label} is required`;

    const editField = screen.getByRole('textbox');
    expect(editField).toBeInTheDocument();
    expect(screen.queryByText(error)).not.toBeInTheDocument();

    await waitFor(() => fireEvent.change(editField, { target: { value } }));
    await waitFor(() => fireEvent.change(editField, { target: { value: '' } }));

    expect(screen.getByText(error)).toBeInTheDocument();
  });
});
