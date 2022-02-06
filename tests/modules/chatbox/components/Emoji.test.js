import { render, screen } from '@testing-library/react';
import preloadAll from 'jest-next-dynamic';

import { Emoji } from '@/modules/chatbox/components';

describe('Emoji', () => {
  beforeAll(async () => {
    await preloadAll();
  });

  it('Emoji Picker should be rendered', () => {
    const setEmoji = jest.fn();
    const { debug, container } = render(<Emoji setEmoji={setEmoji}/>);

    debug();

    expect(container.firstChild).toHaveClass('emoji-picker-react');
  });

  it('Verify that the setEmoji prop works fine', async () => {
    const setEmoji = jest.fn();
    render(<Emoji setEmoji={setEmoji} />);

    const emoji = screen.getByRole('button', { name: '😀' });
    emoji.click();

    expect(setEmoji).toHaveBeenCalledWith(expect.objectContaining({ emoji: '😀' }));
  });
});
