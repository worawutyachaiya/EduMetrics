// components/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

const LoadingSkeleton = ({ rows = 5, columns = 8 }: LoadingSkeletonProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm rounded-xl overflow-hidden">
        <thead className="bg-blue-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="border px-2 py-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white/80">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="border px-2 py-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingSkeleton;
