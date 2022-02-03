import { render } from '@testing-library/react';

import { Backdrop } from '@/layouts/core/Backdrop';

describe('Backdrop', () => {
  it('Render a Backdrop', () => {
    const { container } = render(<Backdrop open={false} />);

    const backdrop = container.querySelector('div[aria-hidden="true"]');

    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveStyle('visibility: hidden');
  });

  it('Verify the open prop works', () => {
    const { container } = render(<Backdrop open={true} />);

    const backdrop = container.querySelector('div[aria-hidden="true"]');

    expect(backdrop).toBeInTheDocument();
    expect(backdrop).not.toHaveStyle('visibility: hidden');
  });
});
