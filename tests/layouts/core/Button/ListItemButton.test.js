import { render, cleanup, screen, fireEvent } from '@testing-library/react';

import { ListItemButton } from '@/layouts/core/Button';

describe('ListItemButton', () => {
  let button;

  const props = {
    title: 'Hello I\'m a tooltip',
  }
  const text = 'Hello I\'m a button';

  const getComponent = (newProps = {}) => <ListItemButton {...props} {...newProps}>{text}</ListItemButton>;

  beforeEach(() => {
    render(getComponent());
    button = screen.getByRole('button');
  });

  afterEach(() => {
    cleanup();
  });

  it('Render a ListItemButton', () => {
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(text);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('Verify that the disabled prop works fine', () => {
    cleanup();

    render(getComponent({ disabled: true }));

    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('Verify that the onClick prop works fine', async () => {
    cleanup();

    const onClick = jest.fn();
    render(getComponent({ onClick }));

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
