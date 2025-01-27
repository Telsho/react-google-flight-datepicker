// hooks/useClientSide.ts
import { useEffect, useState } from 'react';

export const useClientSide = () => {
    const [isClient, setIsClient] = useState(false);
  
    useEffect(() => {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        setIsClient(true);
      } else {
        console.warn('Client-side context not available');
      }
    }, []);
  
    return isClient;
  };

