import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import EntryCard from '../EntryCard';
import { formatDate } from '@/utils/helpers';
import { deleteEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale, IntlProvider } from 'next-intl';

vi.mock('@/utils/helpers', () => ({
  formatDate: vi.fn(),
}));
vi.mock('@/utils/api', () => ({
  deleteEntry: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useTranslations: vi.fn(),
    useLocale: vi.fn(),
    IntlProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('EntryCard', () => {
  const mockRouterPush = vi.fn();
  const mockRouterRefresh = vi.fn();

  const mockEntry = {
    id: '1',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-02T00:00:00Z'),
    title: 'This is a test entry',
    color: '#ff0000',
  };

  const mockTranslations = {
    'card.openContextMenu': 'Open context menu',
    'card.deleteEntry': 'Delete this memo',
    'card.deleteConfirmation': 'Are you sure you want to delete this memo?',
    'card.cancel': 'Cancel',
    'card.delete': 'Delete',
  };

  beforeEach(async () => {
    (useTranslations as Mock).mockImplementation(() => {
      return (key: string) => mockTranslations[key as keyof typeof mockTranslations] || key;
    });
    (useLocale as Mock).mockReturnValue('en');
    (formatDate as Mock).mockImplementation((date: Date) => date.toISOString().split('T')[0]);
    (useRouter as Mock).mockReturnValue({
      push: mockRouterPush,
      refresh: mockRouterRefresh,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) =>
    render(
      <IntlProvider locale="en" messages={{}}>
        {component}
      </IntlProvider>,
    );

  it('renders correctly and matches snapshot', () => {
    const { container } = renderWithProvider(<EntryCard {...mockEntry} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with correct text and date', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);
    expect(screen.getByText('This is a test entry')).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });

  it('opens dropdown menu when clicking the three dots button', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Находим кнопку с тремя точками и кликаем
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Проверяем, что меню открылось
    expect(screen.getByTestId('entryCard-context-menu')).toBeInTheDocument();
    expect(screen.getByText('Delete this memo')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Открываем выпадающее меню
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Проверяем, что меню открылось
    expect(screen.getByTestId('entryCard-context-menu')).toBeInTheDocument();

    // Кликаем вне меню
    fireEvent.mouseDown(document.body);

    // Проверяем, что меню закрылось
    await waitFor(() => {
      expect(screen.queryByTestId('entryCard-context-menu')).not.toBeInTheDocument();
    });
  });

  it('opens modal when clicking delete in the dropdown', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Открываем выпадающее меню
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Находим и кликаем на кнопку удаления
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Проверяем, что открылось модальное окно
    expect(screen.getByText('Are you sure you want to delete this memo?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('closes modal when clicking cancel button', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Открываем выпадающее меню и затем модальное окно
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Проверяем, что модальное окно открылось
    expect(screen.getByText('Are you sure you want to delete this memo?')).toBeInTheDocument();

    // Находим и кликаем на кнопку Cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Проверяем, что модальное окно закрылось
    expect(
      screen.queryByText('Are you sure you want to delete this memo?'),
    ).not.toBeInTheDocument();
  });

  it('calls deleteEntry and router.push when confirming deletion in modal', async () => {
    (deleteEntry as Mock).mockResolvedValueOnce({});
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Открываем выпадающее меню и затем модальное окно
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Проверяем, что модальное окно открылось
    expect(screen.getByText('Are you sure you want to delete this memo?')).toBeInTheDocument();

    // Нажимаем на кнопку Delete в модальном окне
    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);

    // Проверяем, что вызвались нужные функции
    await waitFor(() => {
      expect(deleteEntry).toHaveBeenCalledWith(mockEntry.id);
      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it('closes dropdown and modal when pressing Escape key', async () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Открываем выпадающее меню
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Проверяем, что меню открылось
    expect(screen.getByTestId('entryCard-context-menu')).toBeInTheDocument();

    // Нажимаем Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Проверяем, что дропдаун закрылся
    await waitFor(() => {
      expect(screen.queryByTestId('entryCard-context-menu')).not.toBeInTheDocument();
    });

    // Открываем выпадающее меню и затем модальное окно
    fireEvent.click(dotsButton);
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Проверяем, что модальное окно открылось
    expect(screen.getByText('Are you sure you want to delete this memo?')).toBeInTheDocument();

    // Нажимаем Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Проверяем, что модальное окно закрылось
    await waitFor(() => {
      expect(
        screen.queryByText('Are you sure you want to delete this memo?'),
      ).not.toBeInTheDocument();
    });
  });
});
