import { render, screen, fireEvent } from '@testing-library/react';

import { ContactCard } from '@/layouts/core/ContactCard';

describe('ContactCard', () => {
  it('Verify ContactCard is rendered', () => {
    const { container } = render(<ContactCard />);

    const contactCard = container.querySelector('div.MuiCard-root');

    expect(contactCard).toBeInTheDocument();
  });

  it('Verify title, subheader props work fine', () => {
    const props = {
      title: 'Test Title',
      subheader: 'Test Subheader',
    };

    render(<ContactCard {...props} />);

    const title = screen.getByText(props.title);
    expect(title).toBeInTheDocument();
    expect(title.className).toContain('MuiCardHeader-title');

    const subheader = screen.getByText(props.subheader);
    expect(subheader).toBeInTheDocument();
    expect(subheader.className).toContain('MuiCardHeader-subheader');
  });

  it('Verify that the onClick prop works fine', async () => {
    const onClick = jest.fn();
    const { container } = render(<ContactCard onClick={onClick} />);

    fireEvent.click(container.querySelector('div.MuiCard-root'));

    expect(onClick).toHaveBeenCalled();
  });
});
