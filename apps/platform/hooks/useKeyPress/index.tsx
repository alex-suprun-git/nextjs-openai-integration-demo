import { useEffect } from 'react';

const useKeyPress = (onEscPress: Function, keysList: string[]) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      keysList.forEach((key) => {
        if (event.key === key) {
          onEscPress();
        }
      });
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [keysList, onEscPress]);
};

export default useKeyPress;
