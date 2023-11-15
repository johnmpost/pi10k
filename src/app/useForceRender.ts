import { useState, useCallback } from "react";

export const useForceRender = () => {
  const [key, setKey] = useState(0);

  const forceRender = useCallback(() => {
    setKey((prevKey) => prevKey + 1);
  }, []);

  return [key, forceRender] as const;
};
