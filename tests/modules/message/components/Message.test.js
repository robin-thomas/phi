import { act, render, screen }  from '@testing-library/react';

import Message from '@/modules/message/components/Message';

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ profile: { address: 'address' } })),
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

jest.mock('@/modules/profile/utils/ceramic', () => ({
  __esModule: true,
  getProfile: jest.fn(() => Promise.resolve('')),
}));

describe('Message', () => {
  const chat = {from: 'address', messages: ['message'], attachments: [], date: Date.now()};

  it('Verify that chat prop is required', () => {
    expect(() => render(<Message />)).toThrowError();
  });

  it('Verify that Message component can be rendered', async () => {
    await act(async () => render(<Message chat={chat} />));

    expect(screen.getByText('message')).toBeInTheDocument();
  });

  it('Verify that the Message component can render attachments', async () => {
    const _chat = {...chat, attachments: [{location: 'location', mimeType: 'mimeType'}]};

    await act(async () => render(<Message chat={_chat} />));

    expect(screen.getByText('message')).toBeInTheDocument();
  });
});
