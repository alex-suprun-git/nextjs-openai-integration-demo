'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface PromptContextProps {
  promptSymbolsLimit: number;
  promptSymbolsUsed: number;
}

const PromptContext = createContext<PromptContextProps | undefined>(undefined);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

interface PromptProviderProps {
  children: ReactNode;
  value: PromptContextProps;
}

export const PromptProvider: React.FC<PromptProviderProps> = ({ children, value }) => (
  <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
);
