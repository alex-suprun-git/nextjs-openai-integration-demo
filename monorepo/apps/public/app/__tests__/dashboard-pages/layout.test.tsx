import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '@/app/(dashboard)/layout';
import { getUserByClerkId } from '@/utils/auth';
import { createTranslator, useTranslations } from 'next-intl';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

describe('DashboardLayout', () => {
  beforeEach(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'Header',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  it('should render correctly with provided children', async () => {
    // Arrange
    const mockUser = {
      promptSymbolsLimit: 1000,
      promptSymbolsUsed: 400,
      promptSymbolsLimitRenewal: new Date(),
    };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);

    // Act
    render(
      // Use a wrapper to handle the async component
      <div>{await DashboardLayout({ children: <div /> })}</div>,
    );

    // Assert
    expect(await screen.findByTestId('header')).toBeInTheDocument();
    expect(await screen.findByTestId('user-button')).toBeInTheDocument();
    expect(screen.getAllByText(/symbols remaining/i)).toHaveLength(2);
  });
});
