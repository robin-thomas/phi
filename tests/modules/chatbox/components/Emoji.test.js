import { render, screen, waitFor } from '@testing-library/react';

import { Emoji } from '@/modules/chatbox/components';

describe('Emoji', () => {
  it('Emoji Picker should be rendered', async () => {
    const setEmoji = jest.fn();
    render(<Emoji setEmoji={setEmoji}/>);

    await waitFor(() => expect(screen.getByRole('button', { name: '😀' })).toBeInTheDocument());
  });

  it('Verify that the setEmoji prop works fine', async () => {
    const setEmoji = jest.fn();
    render(<Emoji setEmoji={setEmoji} />);

    await waitFor(() => expect(screen.getByRole('button', { name: '😀' })).toBeInTheDocument());

    const emoji = screen.getByRole('button', { name: '😀' });
    emoji.click();

    expect(setEmoji).toHaveBeenCalledWith(expect.objectContaining({ emoji: '😀' }));
  });
});
