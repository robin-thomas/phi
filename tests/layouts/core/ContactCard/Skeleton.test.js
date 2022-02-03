import { render } from '@testing-library/react';

import { Skeleton } from '@/layouts/core/ContactCard';

describe('ContactCard Skeleton', () => {
  it('Verify that the skeleton is rendered', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('div.MuiCard-root');

    expect(skeleton).toBeInTheDocument();
  });

  it('Verify that the skeleton is rendered', () => {
    const count = 4;
    const { container } = render(<Skeleton count={count} />);

    const skeletons = container.querySelectorAll('div.MuiCard-root');

    expect(skeletons.length).toBe(count);
    skeletons.forEach((skeleton) => expect(skeleton).toBeInTheDocument());
  });

  it('Verify that if count prop is not passed, it defaults to 1 skeleton', () => {
    const { container } = render(<Skeleton />);

    const skeletons = container.querySelectorAll('div.MuiCard-root');

    expect(skeletons.length).toBe(1);
    skeletons.forEach((skeleton) => expect(skeleton).toBeInTheDocument());
  });
});
