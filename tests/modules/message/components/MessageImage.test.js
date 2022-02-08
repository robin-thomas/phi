import { render } from '@testing-library/react';

import MessageImage from '@/modules/message/components/MessageImage';

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ address: 'address' })),
}));

jest.mock('@/modules/file/utils/bucket', () => ({
  __esModule: true,
  default: {
    getKey: jest.fn(() => Promise.resolve('key')),
  },
}));

jest.mock('@/modules/file/utils/ceramic', () => ({
  __esModule: true,
  decrypt: jest.fn(() => Promise.resolve('')),
}));

jest.mock('@/modules/file/utils/image', () => ({
  __esModule: true,
  getImageDetails: jest.fn(() => Promise.resolve({ width: 100, height: 100 })),
  downloadImageFromBucket: jest.fn((key, loc, mimeType, callback) => {
    callback('hello');
    return Promise.resolve(null);
  }),
}));

describe('MessageImage', () => {
  const attachment = {
    location: 'location',
    mimeType: 'mimeType',
  };

  it('Verify that the attachment prop is required', () => {
    expect(() => render(<MessageImage />)).toThrowError();
  });

  it('Verify that the MessagImage is rendered as skeleton if no image', () => {
    const { container } = render(<MessageImage attachment={attachment} />);

    const skeleton = container.querySelector('span.MuiSkeleton-root');

    expect(skeleton).toBeInTheDocument();
  });
});
