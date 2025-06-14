import React from 'react';

function PreviewCard ({ children, className = '', ...props }){
  return (
    <div
      className={`border rounded shadow bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default PreviewCard;
