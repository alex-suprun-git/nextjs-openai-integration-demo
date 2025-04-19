import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@/utils/locales', () => ({
  setUserLocale: vi.fn(),
}));
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

import LanguageSwitcher from '../LanguageSwitcher';
import { setUserLocale } from '@/utils/locales';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component correctly', () => {
    const { container } = render(<LanguageSwitcher />);
    expect(container).toMatchSnapshot();
  });

  it('calls setUserLocale with the correct lang', () => {
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByText('English'));
    expect(setUserLocale).toHaveBeenCalledWith('en');

    fireEvent.click(screen.getByText('Deutsch'));
    expect(setUserLocale).toHaveBeenCalledWith('de');
  });
});
