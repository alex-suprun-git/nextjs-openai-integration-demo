import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '@/app/(dashboard)/layout';
import { getUserByClerkId } from '@/utils/auth';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

vi.mock('@/components/Header', () => ({
  default: ({
    userPromptLimit,
    userPromptUsed,
  }: {
    userPromptLimit: string;
    userPromptUsed: string;
  }) => (
    <div data-testid="header">
      <div>{userPromptLimit}</div>
      <div>{userPromptUsed}</div>
    </div>
  ),
}));

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render correctly with provided children', async () => {
    // Arrange
    const mockUser = {
      promptSymbolsLimit: 1000,
      promptSymbolsUsed: 400,
    };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);

    const TestChild = () => <div data-testid="child">Test Child</div>;

    // Act
    render(
      // Use a wrapper to handle the async component
      <div>{await DashboardLayout({ children: <TestChild /> })}</div>,
    );

    // Assert
    expect(await screen.findByTestId('header')).toBeInTheDocument();
    expect(await screen.findByTestId('user-button')).toBeInTheDocument();
    expect(await screen.findByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should format and pass correct props to Header', async () => {
    // Arrange
    const mockUser = {
      promptSymbolsLimit: 1000,
      promptSymbolsUsed: 400,
    };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);

    const formattedSymbolsLeft = new Intl.NumberFormat().format(
      mockUser.promptSymbolsLimit - mockUser.promptSymbolsUsed,
    );
    const formattedSymbolsLimit = new Intl.NumberFormat().format(mockUser.promptSymbolsLimit);

    // Act
    render(
      // Use a wrapper to handle the async component
      <div>{await DashboardLayout({ children: <div /> })}</div>,
    );

    // Assert
    const header = await screen.findByTestId('header');
    expect(header).toBeInTheDocument();
    // Check the text content in the Header mock component
    expect(screen.getByText(formattedSymbolsLeft)).toBeInTheDocument();
    expect(screen.getByText(formattedSymbolsLimit)).toBeInTheDocument();
  });
});
