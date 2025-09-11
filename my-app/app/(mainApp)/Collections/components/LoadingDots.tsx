import React from 'react'

const LoadingDots = () => {
  return (
    <div className="col-span-full py-8 flex justify-center">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>)
}

export default LoadingDots