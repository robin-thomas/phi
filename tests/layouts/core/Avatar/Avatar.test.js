import { render } from '@testing-library/react';

import { Avatar } from '@/layouts/core/Avatar';

describe('Avatar', () => {
  it('Render a Avatar', () => {
    const { container } = render(<Avatar />);

    const avatar = container.querySelector('div.MuiAvatar-root');

    expect(avatar).toBeInTheDocument();
    expect(avatar.firstChild).toHaveAttribute('data-testid', 'PersonIcon');
    expect(avatar).toHaveStyle('width: 200px');
    expect(avatar).toHaveStyle('height: 200px');
  });

  it('Render a mini Avatar', () => {
    const { container } = render(<Avatar mini />);

    const avatar = container.querySelector('div.MuiAvatar-root');

    expect(avatar).toBeInTheDocument();
    expect(avatar.firstChild).toHaveAttribute('data-testid', 'PersonIcon');
    expect(avatar).toHaveStyle('width: 50px');
    expect(avatar).toHaveStyle('height: 50px');
  });

  it('Verify that the skeleton props works fine', () => {
    const { container } = render(<Avatar skeleton />);

    const avatar = container.querySelector('span.MuiSkeleton-root');

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveStyle('width: 200px');
    expect(avatar).toHaveStyle('height: 200px');
  });

  it('Verify that the mini skeleton props works fine', () => {
    const { container } = render(<Avatar mini skeleton />);

    const avatar = container.querySelector('span.MuiSkeleton-root');

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveStyle('width: 50px');
    expect(avatar).toHaveStyle('height: 50px');
  });
});
