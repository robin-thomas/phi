import { render, screen } from '@testing-library/react';

import Login from '@/modules/wallet/components/Login';

const mockSetProvider = jest.fn();
const mockSetNetwork = jest.fn();

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ setProvider: mockSetProvider, setNetwork: mockSetNetwork })),
}));

jest.mock('@/modules/wallet/utils/onboard', () => ({
  __esModule: true,
  isLoggedIn: jest.fn(() => false),
  login: jest.fn((callback) => callback(null)),
}));

describe('Wallet', () => {
  it('If provider is not available, sets to null', () => {
    render(<Login />);

    const login = screen.getByRole('button');
    expect(login).toBeInTheDocument();

    login.click();

    expect(mockSetProvider).toHaveBeenCalledWith(null);
    expect(mockSetNetwork).toHaveBeenCalledWith(null);
  });
});
