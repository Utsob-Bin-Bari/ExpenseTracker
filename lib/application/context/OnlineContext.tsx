import { createContext, useContext } from 'react';

interface OnlineContextType {
  isOnline: boolean;
}

export const OnlineContext = createContext<OnlineContextType | undefined>(undefined);

export const useOnline = (): OnlineContextType => {
  const context = useContext(OnlineContext);
  if (!context) throw new Error('useOnline must be used within OnlineManagerProvider');
  return context;
};
