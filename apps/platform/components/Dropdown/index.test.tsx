import { render, screen, fireEvent } from '@testing-library/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { describe, expect, it, vi } from 'vitest';
import Dropdown from './index';

describe('Dropdown Component', () => {
  const mockOnClick1 = vi.fn();
  const mockOnClick2 = vi.fn();

  const options = [
    {
      label: 'Option 1',
      onClick: mockOnClick1,
      testId: 'option-1',
    },
    {
      label: 'Option 2',
      onClick: mockOnClick2,
      testId: 'option-2',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dropdown trigger', () => {
    render(
      <Dropdown
        trigger={<BsThreeDotsVertical data-testid="dots-icon" />}
        options={options}
        triggerTestId="dropdown-test-trigger"
      />,
    );

    expect(screen.getByTestId('dropdown-test-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('dots-icon')).toBeInTheDocument();
  });

  it('should open dropdown menu when trigger is clicked', () => {
    render(
      <Dropdown
        trigger={<BsThreeDotsVertical />}
        options={options}
        menuTestId="dropdown-test-menu"
      />,
    );

    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(trigger);

    expect(screen.getByTestId('dropdown-test-menu')).toBeInTheDocument();
    expect(screen.getByTestId('option-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-2')).toBeInTheDocument();
  });

  it('should call the option onClick function when option is clicked', () => {
    render(<Dropdown trigger={<BsThreeDotsVertical />} options={options} />);

    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(trigger);

    const option1 = screen.getByTestId('option-1');
    fireEvent.click(option1);

    expect(mockOnClick1).toHaveBeenCalledTimes(1);
    expect(mockOnClick2).not.toHaveBeenCalled();
  });

  it('should close the dropdown after an option is clicked', () => {
    render(
      <Dropdown
        trigger={<BsThreeDotsVertical />}
        options={options}
        menuTestId="dropdown-test-menu"
      />,
    );

    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(trigger);

    const option1 = screen.getByTestId('option-1');
    fireEvent.click(option1);

    expect(screen.queryByTestId('dropdown-test-menu')).not.toBeInTheDocument();
  });

  it('should close the dropdown when Escape key is pressed', () => {
    render(
      <Dropdown
        trigger={<BsThreeDotsVertical />}
        options={options}
        menuTestId="dropdown-test-menu"
      />,
    );

    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(trigger);

    expect(screen.getByTestId('dropdown-test-menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByTestId('dropdown-test-menu')).not.toBeInTheDocument();
  });

  it('should close the dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside Element</div>
        <Dropdown
          trigger={<BsThreeDotsVertical />}
          options={options}
          menuTestId="dropdown-test-menu"
        />
      </div>,
    );

    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.click(trigger);

    expect(screen.getByTestId('dropdown-test-menu')).toBeInTheDocument();

    const outsideElement = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outsideElement);

    expect(screen.queryByTestId('dropdown-test-menu')).not.toBeInTheDocument();
  });

  it('should use custom align class when provided', () => {
    render(<Dropdown trigger={<BsThreeDotsVertical />} options={options} align="start" />);

    const dropdownElement = screen.getByRole('button').parentElement;
    expect(dropdownElement).toHaveClass('dropdown-start');
    expect(dropdownElement).not.toHaveClass('dropdown-end');
  });
});
