import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const DialogWrapper = ({ children = null, isMobile = false }) => (isMobile ? createPortal(
  <div className="react-google-flight-datepicker">
    {children}
  </div>,
  document.querySelector('body'),
) : (<>{children}</>));

DialogWrapper.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.string,
};

export default DialogWrapper;
