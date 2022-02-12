import { render, screen, fireEvent } from '@testing-library/react';

import { Emoji } from '@/modules/chatbox/components';

describe('Emoji', () => {
  it('Verify that the setEmoji prop works fine', async () => {
    const setEmoji = jest.fn();
    render(<Emoji setEmoji={setEmoji} />);

    const emoji = await screen.findByRole('button', { name: '😀' });
    expect(emoji).toBeInTheDocument();

    fireEvent.click(emoji);

    expect(setEmoji).toHaveBeenCalledWith(expect.objectContaining({ emoji: '😀' }));
  });
});
