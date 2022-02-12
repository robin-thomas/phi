import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { Emoji } from '@/modules/chatbox/components';

describe('Emoji', () => {
  xit('Emoji Picker should be rendered', async () => {
    const setEmoji = jest.fn();
    render(<Emoji setEmoji={setEmoji}/>);

    await waitFor(() => expect(screen.getByRole('button', { name: '😀' })).toBeInTheDocument());
  });

  xit('Verify that the setEmoji prop works fine', async () => {
    const setEmoji = jest.fn();
    render(<Emoji setEmoji={setEmoji} />);

    await waitFor(() => expect(screen.getByRole('button', { name: '😀' })).toBeInTheDocument());

    const emoji = screen.getByRole('button', { name: '😀' });
    fireEvent.click(emoji);

    expect(setEmoji).toHaveBeenCalledWith(expect.objectContaining({ emoji: '😀' }));
  });
});
