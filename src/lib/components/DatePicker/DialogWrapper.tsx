// DialogWrapper.tsx
import React from 'react';
import { createPortal } from 'react-dom';

interface DialogWrapperProps {
  children?: React.ReactNode;
  isMobile?: boolean;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({ 
  children = null, 
  isMobile = false 
}) => (
  isMobile ? createPortal(
    <div className="react-google-flight-datepicker">
      {children}
    </div>,
    document.querySelector('body')!
  ) : (
    <>{children}</>
  )
);

export default DialogWrapper;
