import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import useKeyPress from '.';

describe('useKeyPress', () => {
  const mockCallback = vi.fn();

  beforeEach(() => {
    mockCallback.mockClear();
  });

  it('should add and remove event listener for specified keys', () => {
    const { unmount } = renderHook(() => useKeyPress(mockCallback, ['Escape']));

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Unmount the hook to check if event listener is removed
    unmount();

    // Simulate keydown event after unmount
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockCallback).toHaveBeenCalledTimes(1); // Should still be 1 since the listener was removed
  });

  it('should not call callback for other keys', () => {
    renderHook(() => useKeyPress(mockCallback, ['Escape']));

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
