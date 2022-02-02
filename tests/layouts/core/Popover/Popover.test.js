import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Popover } from '@/layouts/core/Popover';

describe('Popover', () => {
  const ref = { current: null };

  const open = {
    text: 'Open Popover',
    fn: (e) => ref.current.handleOpen(e),
  }

  const close = {
    text: 'Close Popover',
    fn: (e) => ref.current.handleClose(e),
  }

  const title = 'I\'m a popover';
  const component = (
    <>
      <Popover ref={ref}>{title}</Popover>
      <button onClick={open.fn}>{open.text}</button>
      <button onClick={close.fn}>{close.text}</button>
    </>
  )

  it('Verify Popover is not shown before click', async () => {
    render(component);

    const popover = screen.queryByText(title);
    expect(popover).not.toBeInTheDocument();
  });

  it( 'Verify Popover is shown after click, and removed after outside click', async () => {
    render(component);

    fireEvent.click(screen.getByText(open.text));
    await waitFor(() => expect(screen.queryByText(title)).toBeInTheDocument());

    fireEvent.click(screen.getByText(close.text));
    await waitFor(() => expect(screen.queryByText(title)).not.toBeInTheDocument());
  });
});
