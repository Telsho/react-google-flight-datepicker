// DialogWrapper.tsx
import React from 'react';
import { createPortal } from 'react-dom';
import { useClientSide } from '../../hooks/useClientSide';

interface DialogWrapperProps {
  children?: React.ReactNode;
  isMobile?: boolean;
}


const DialogWrapper: React.FC<DialogWrapperProps> = ({ 
  children = null, 
  isMobile = false 
}) => {
  const isClient = useClientSide();
  
  if (!isClient) return null;
  
  return isMobile
    ? createPortal(<div>{children}</div>, document.body)
    : children;
};

export default DialogWrapper;
