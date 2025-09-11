import React from 'react'

const CategoryHeader = ({ state, searchParams }: { state: any, searchParams: URLSearchParams }) => {
    if (!searchParams?.get("category") || !state.categoryDescription) return null;

    return (
        <div className="bg-gradient-to-r from-lightBeige  border border-blue-100 rounded-xl p-6 mb-8 hidden md:block">
            <div className="flex items-start gap-4">
                <div className="w-1 h-16 bg-primaryColor rounded-full flex-shrink-0"></div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {searchParams.get("category")}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {state.categoryDescription}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CategoryHeader