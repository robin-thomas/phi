import { render, screen } from '@testing-library/react';

import { PillButton } from '@/layouts/core/Button';

describe('PillButton', () => {
  it('Render a PillButton', () => {
    render(<PillButton>Test</PillButton>);

    const pillButton = screen.getByRole('button');

    expect(pillButton).toBeInTheDocument();
    expect(pillButton).toHaveTextContent('Test');
    expect(pillButton).not.toBeDisabled();
  });
});
