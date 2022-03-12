import { render, screen, waitFor } from '@testing-library/react';

import EditAvatar from '@/modules/profile/components/EditAvatar';

const pic = 'pic';
const file = 'file';
const address = '0x0000000000000000000000000000000000000000';
const mockUpdateProfileImage = jest.fn();

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ profileKey: null, profile: { address }, setProfile: jest.fn() })),
}));

jest.mock('@/modules/file/utils/image', () => ({
  __esModule: true,
  uploadImage: jest.fn(() => Promise.resolve(file)),
}));

jest.mock('@/modules/file/utils/bucket', () => ({
  __esModule: true,
  default: {
    upload: jest.fn(() => Promise.resolve(pic)),
  },
}));

jest.mock('@/modules/profile/utils/ceramic', () => ({
  __esModule: true,
  updateProfileImage: jest.fn((...args) => Promise.resolve(mockUpdateProfileImage(...args))),
}));

describe('Profile', () => {
  it('Verify that EditAvatar component can be rendered', async () => {
    render(<EditAvatar />);

    const editAvatar = screen.getByRole('button');
    expect(editAvatar).toBeInTheDocument();

    editAvatar.click();

    await waitFor(() => expect(mockUpdateProfileImage).toHaveBeenCalledWith(address, pic, file));
  });
});
