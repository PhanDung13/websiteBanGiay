import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
export const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => socket.close();
  }, []);
  console.log(socket);
  return (
    <DataContext.Provider value={{ socket: socket }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
