import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;