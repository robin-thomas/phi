import { render } from '@testing-library/react';

import { Skeleton } from '@/modules/message/components';

describe('Message Skeleton', () => {
  it('Verify that the skeleton is rendered', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('span.MuiSkeleton-root');

    expect(skeleton).toBeInTheDocument();
  });
});
