'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import useKeyPress from '@/hooks/useKeyPress';
import clsx from 'clsx';

export type DropdownOption = {
  label: string;
  icon?: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  testId?: string;
};

type DropdownProps = {
  trigger: ReactNode;
  options: DropdownOption[];
  align?: 'start' | 'end';
  triggerClassName?: string;
  menuClassName?: string;
  triggerTestId?: string;
  menuTestId?: string;
};

const Dropdown = ({
  trigger,
  options,
  align = 'end',
  triggerClassName = '',
  menuClassName = '',
  triggerTestId = 'dropdown-trigger',
  menuTestId = 'dropdown-menu',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useKeyPress(() => {
    setIsOpen(false);
  }, ['Escape']);

  const handleOptionClick = (e: React.MouseEvent, onClick: (e: React.MouseEvent) => void) => {
    onClick(e);
    setIsOpen(false);
  };

  return (
    <div
      className={clsx('dropdown', align === 'end' ? 'dropdown-end' : 'dropdown-start')}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className={clsx(
          'border-1 btn btn-ghost btn-xs btn-circle border-gray-300 p-1 text-gray-600 hover:bg-gray-100 focus:outline-none',
          triggerClassName,
        )}
        data-testid={triggerTestId}
      >
        {trigger}
      </button>
      {isOpen && (
        <ul
          data-testid={menuTestId}
          className={clsx(
            'dropdown-content menu menu-sm z-[100] mt-1 rounded-md border border-gray-200 bg-white p-0 focus:outline-none',
            menuClassName,
          )}
        >
          {options.map((option, index) => (
            <li key={index} className="rounded-md">
              <button
                onClick={(e) => handleOptionClick(e, option.onClick)}
                className={clsx(
                  'btn btn-sm items-center gap-2 border-0 bg-gray-50 py-2 text-sm focus:outline-none',
                  option.className,
                )}
                data-testid={option.testId}
              >
                {option.icon && option.icon}
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
