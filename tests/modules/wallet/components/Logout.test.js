import { render, screen } from '@testing-library/react';

import Logout from '@/modules/wallet/components/Logout';

const mockLogout = jest.fn();

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ profile: { address: '0x123' } })),
}));

jest.mock('@/modules/wallet/utils/onboard', () => ({
  __esModule: true,
  logout: () => mockLogout(),
}));

describe('Wallet', () => {
  it('Logout user on click', () => {
    render(<Logout />);

    const logout = screen.getByRole('button');
    expect(logout).toBeInTheDocument();

    logout.click();

    expect(mockLogout).toHaveBeenCalled();
  });
});
