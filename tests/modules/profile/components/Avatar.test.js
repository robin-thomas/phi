import { render, waitFor } from '@testing-library/react';

import Avatar from '@/modules/profile/components/Avatar';

const profileKey = 'profileKey';
const address = '0x0000000000000000000000000000000000000000';
const mockDownloadProfilePicture = jest.fn();

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ profileKey, profile: {} })),
}));

jest.mock('@/modules/file/utils/image', () => ({
  __esModule: true,
  downloadProfilePicture: jest.fn((...args) => Promise.resolve(mockDownloadProfilePicture(...args))),
}));

describe('Profile', () => {
  const image = {
    original: {
      mimeType: 'image/png',
    },
  };

  it('Verify that skeleton is rendered as default', async () => {
    const { container } = render(<Avatar />);

    const avatar = container.querySelector('span.MuiSkeleton-root');
    expect(avatar).toBeInTheDocument();
  });

  it('Verify that skeleton is rendered if uploading', async () => {
    const { container } = render(<Avatar uploading={true} />);

    const avatar = container.querySelector('span.MuiSkeleton-root');
    expect(avatar).toBeInTheDocument();
  });

  it('Verify that skeleton is removed after downloading', async () => {
    const { container } = render(<Avatar profile={{ address, image }} />);

    await waitFor(() => expect(container.querySelector('span.MuiSkeleton-root')).not.toBeInTheDocument());

    expect(mockDownloadProfilePicture).toHaveBeenCalledWith(profileKey, address, image.original.mimeType);

    const avatar = container.querySelector('div.MuiAvatar-root');
    expect(avatar).toBeInTheDocument();
  });
});
