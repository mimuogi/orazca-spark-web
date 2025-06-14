import React from 'react';

function PreviewCardContent ({ children, className = '', ...props }){
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default PreviewCardContent;
