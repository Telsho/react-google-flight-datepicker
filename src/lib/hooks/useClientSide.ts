// hooks/useClientSide.ts
import { useEffect, useState } from 'react';

export const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

