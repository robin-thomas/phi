import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

import { FabButton } from '@/layouts/core/Button';

describe('FabButton', () => {
  let button;

  const props = {
    title: 'Hello I\'m a tooltip',
  }

  beforeEach(() => {
    render(<FabButton {...props}>Test</FabButton>);
    button = screen.getByRole('button');
  });

  afterEach(() => {
    cleanup();
  });

  it('Render a FabButton', () => {
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test');
    expect(button).not.toBeDisabled();
  });

  it('Verify whether tooltip works on hover', async () => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseOver(button);
    await waitFor(() => screen.getByRole('tooltip'));

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent(props.title);
  });

  it('Verify that the disabled option works', () => {
    cleanup();

    render(<FabButton {...props} disabled>Test</FabButton>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('Verify that the onClick handler works', async () => {
    cleanup();

    const onClick = jest.fn();
    render(<FabButton {...props} onClick={onClick}>Test</FabButton>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
