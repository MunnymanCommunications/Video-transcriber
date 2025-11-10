
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-300">Processing...</p>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
    </div>
  );
};

export default Loader;
