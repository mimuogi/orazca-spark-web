import React from 'react';

function Card ({ children, className = '', ...props }){
  return (
    <div
      className={`border rounded shadow bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
