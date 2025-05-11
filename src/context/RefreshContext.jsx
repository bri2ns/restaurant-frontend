import React, { createContext, useState, useEffect } from "react";

export const RefreshContext = createContext();

export const RefreshProvider = ({ children, interval = 60000 }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRefreshCount((prev) => prev + 1);
    }, interval);

    return () => clearInterval(id);
  }, [interval]);

  return (
    <RefreshContext.Provider value={refreshCount}>
      {children}
    </RefreshContext.Provider>
  );
};
