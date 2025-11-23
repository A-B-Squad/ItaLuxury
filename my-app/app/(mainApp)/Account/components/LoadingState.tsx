const LoadingState = () => (
    <div className="container py-8 px-4 md:px-8 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement de votre compte...</p>
            </div>
        </div>
    </div>
);
export default LoadingState;