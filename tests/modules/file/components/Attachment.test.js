import { render, screen } from '@testing-library/react';

import Attachment from '@/modules/file/components/Attachment';

const file = { name: 'file.png' };
const address = '0x0000000000000000000000000000000000000000';

const removeFile = jest.fn();
const setAttachments = jest.fn(() => Promise.resolve());

jest.mock('@/modules/file/utils/image', () => ({
  __esModule: true,
  readImage: jest.fn(() => Promise.resolve(Buffer.from(''))),
}));

jest.mock('@/modules/file/utils/ceramic', () => ({
  __esModule: true,
  encrypt: jest.fn(() => Promise.resolve(Buffer.from(''))),
}));

jest.mock('@/modules/file/utils/bucket', () => ({
  __esModule: true,
  default: {
    getKey: jest.fn(() => Promise.resolve('key')),
    upload: jest.fn(() => Promise.resolve()),
  },
}));

describe('Attachment', () => {
  it('Verify that error is thrown if required props are not passed', async () => {
    expect(() => render(<Attachment />)).toThrowError();
    expect(() => render(<Attachment file={file} />)).toThrowError();
    expect(() => render(<Attachment file={file} address={address} />)).toThrowError();
  });

  it('Verify that component is rendered if required props are passed', () => {
    render(<Attachment file={file} address={address} removeFile={removeFile} setAttachments={setAttachments} />);

    expect(screen.getByText(file.name)).toBeInTheDocument();
  });
});
