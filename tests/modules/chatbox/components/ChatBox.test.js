import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { ChatBox } from '@/modules/chatbox/components';
import Bucket from '@/modules/file/utils/bucket';
import Chat from '@/modules/message/utils/textile/chat';

jest.mock('@/modules/common/hooks', () => ({
  __esModule: true,
  useAppContext: jest.fn(() => ({ activeContact: 'contact' })),
}));

jest.mock('@/modules/message/utils/textile/chat', () => ({
  __esModule: true,
  default: {
    setThreadId: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('@/modules/file/utils/image', () => ({
  __esModule: true,
  uploadImage: jest.fn(() => Promise.resolve({ name: 'image.jpg' })),
  readImage: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('@/modules/file/utils/ceramic', () => ({
  __esModule: true,
  encrypt: jest.fn(() => Promise.resolve('')),
}));

jest.mock('@/modules/file/utils/bucket', () => ({
  __esModule: true,
  default: {
    getKey: jest.fn(() => Promise.resolve('key')),
    upload: jest.fn(() => Promise.resolve(null)),
  },
}));

describe('ChatBox', () => {
  const threadID = '1';

  beforeEach(() => {
    Chat.post.mockClear();

    render(<ChatBox threadID={threadID} />);
  });

  it('ChatBox is rendered', () => {
    const chatbox = screen.getByRole('textbox');

    expect(chatbox).toBeInTheDocument();
  });

  it('Verify that submit is enabled only when a message is typed', () => {
    const submitBtn = screen.getByLabelText('Send message').firstChild;
    expect(submitBtn).toBeDisabled();

    const chatbox = screen.getByRole('textbox');
    fireEvent.change(chatbox, { target: { value: 'Hello' } });

    expect(submitBtn).not.toBeDisabled();
  });

  it('Verify that submit button triggers callback', async () => {
    const chatbox = screen.getByRole('textbox');
    fireEvent.change(chatbox, { target: { value: 'Hello' } });

    const submitBtn = screen.getByLabelText('Send message').firstChild;
    expect(submitBtn).not.toBeDisabled();
    submitBtn.click();

    await waitFor(() => expect(Chat.post).toHaveBeenCalledWith('contact', 'Hello', []));
  });

  it('Verify that selected emoji is added to chatbox', async () => {
    const chatbox = screen.getByRole('textbox');
    expect(chatbox).toHaveValue('');

    const emojiOpenBtn = screen.getByLabelText('Add emojis').firstChild;
    emojiOpenBtn.click();

    await waitFor(() => expect(screen.getByRole('button', { name: '😀' })).toBeInTheDocument());

    const emoji = screen.getByRole('button', { name: '😀' });
    emoji.click();

    await waitFor(() => expect(chatbox).toHaveValue('😀'));
  }, 20000); /* 20s timeout */

  it('Verify that a file can be attached to chatbox', async () => {
    const attachFileBtn = screen.getByLabelText('Attach file').firstChild;
    attachFileBtn.click();

    await waitFor(() => expect(Bucket.upload).toHaveBeenCalled());

    expect(screen.getByText('image.jpg')).toBeInTheDocument();
  });
});
