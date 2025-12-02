import React from 'react'
import { Loader } from 'lucide-react';

const Loading = () => {
  return (
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="rounded-full animate-spin">
              <Loader /> 
            </div>
          </div>
        </div>
      </div>
    );
}

export default Loading;