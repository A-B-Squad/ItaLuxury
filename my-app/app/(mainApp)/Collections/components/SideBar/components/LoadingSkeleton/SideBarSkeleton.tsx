import React, { memo } from 'react'

const SideBarSkeleton = () => {
    return (
        <div className="w-80 h-screen top-16 bg-white shadow-md animate-pulse rounded-lg">
            <div className="p-4 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default memo(SideBarSkeleton)