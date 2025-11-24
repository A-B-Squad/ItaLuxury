const LoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="h-5 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default LoadingSkeleton