import React from 'react'

const ContactFormSkeleton = () => {
    return (
        <div className="w-full border bg-white shadow-lg rounded-lg animate-pulse">
            <div className="py-4 px-2 border-b bg-gray-50">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="p-5 flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-4 flex-1">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-primaryColor rounded w-24 ml-auto"></div>
                </div>
            </div>
        </div>
    );
}
export default ContactFormSkeleton

