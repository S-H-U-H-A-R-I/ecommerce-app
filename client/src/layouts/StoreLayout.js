import React from'react';

const StoreLayout = ({ children }) => {
  return (
    <div>
      <h1>Store Dashboard</h1>
      {children}
    </div>
  );
};

export default StoreLayout;