'use client';

import { useEffect } from 'react';
import ErrorMessage from '@/components/ErrorMessage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('An unexpected error occurred:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorMessage error={error} reset={reset} />
      </body>
    </html>
  );
}
