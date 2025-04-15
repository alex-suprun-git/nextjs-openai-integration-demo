import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Drawer from '.';
import { createRef, RefObject } from 'react';

describe('Drawer', () => {
  it('renders the icon and children', () => {
    const icon = <span>Icon</span>;
    const children = <div>Drawer Content</div>;
    const mockRef = createRef() as RefObject<HTMLInputElement>;

    render(
      <Drawer toggleRef={mockRef} icon={icon}>
        {children}
      </Drawer>,
    );

    // Check if the icon is rendered
    expect(screen.getByText('Icon')).toBeInTheDocument();

    // Check if the children are rendered
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('toggles the drawer when the icon is clicked', () => {
    const icon = <span>Icon</span>;
    const children = <div>Drawer Content</div>;
    const mockRef = createRef() as RefObject<HTMLInputElement>;

    render(
      <Drawer toggleRef={mockRef} icon={icon}>
        {children}
      </Drawer>,
    );

    const drawerToggle = screen.getByRole('checkbox', { hidden: true }) as HTMLInputElement;

    // Initially, the drawer should be closed
    expect(drawerToggle).not.toBeChecked();

    // Click the icon to open the drawer
    fireEvent.click(screen.getByText('Icon'));
    expect(drawerToggle).toBeChecked();

    // Click the overlay to close the drawer
    fireEvent.click(screen.getByLabelText('close sidebar'));
    expect(drawerToggle).not.toBeChecked();
  });
});
