import React, { ReactNode, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { OnlineContext } from '../context/OnlineContext';

export const OnlineManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    NetInfo.fetch().then((state) => setIsOnline(!!state.isConnected));
  }, []);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });
  }, []);

  return (
    <OnlineContext.Provider value={{ isOnline }}>
      {children}
    </OnlineContext.Provider>
  );
};
