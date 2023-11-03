import { createContext } from 'react';

export const SocketContext = createContext();

export const ContextProvider = ({ children }) => {
  return <SocketContext.Provider>{children}</SocketContext.Provider>;
};
