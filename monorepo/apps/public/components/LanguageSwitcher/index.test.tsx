import { vi } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { setUserLocale } from '@/utils/locales';
import LanguageSwitcher from '.';

// Mock setUserLocale
vi.mock('@/utils/locales', () => ({
  setUserLocale: vi.fn(),
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<LanguageSwitcher />);
    expect(container).toMatchSnapshot();
  });

  it('calls setUserLocale with the correct language when a language is clicked', () => {
    render(<LanguageSwitcher />);

    const englishLink = screen.getByText('English');
    fireEvent.click(englishLink);
    expect(setUserLocale).toHaveBeenCalledWith('en');

    const germanLink = screen.getByText('Deutsch');
    fireEvent.click(germanLink);
    expect(setUserLocale).toHaveBeenCalledWith('de');
  });
});
