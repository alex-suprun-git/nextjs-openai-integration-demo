import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { update } from '@/utils/actions';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call revalidatePath for each path', () => {
    const paths = ['/path1', '/path2', '/path3'];
    update(paths);

    expect(revalidatePath).toHaveBeenCalledTimes(paths.length);
    paths.forEach((path, index) => {
      expect(revalidatePath).toHaveBeenNthCalledWith(index + 1, path);
    });
  });

  it('should not call revalidatePath if no paths are provided', () => {
    update();

    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('should call revalidatePath once if one path is provided', () => {
    const paths = ['/single-path'];
    update(paths);

    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith('/single-path');
  });

  it('should handle empty paths array', () => {
    const paths: string[] = [];
    update(paths);

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
