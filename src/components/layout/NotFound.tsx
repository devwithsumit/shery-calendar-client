import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-full transition-colors duration-200">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">Page Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">The page you are looking for doesn't exist.</p>
                <button
                    onClick={() => window.history.back()}
                    className="bg-primary/90 hover:bg-primary/80 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                    Go Back
                </button>
                {/* <a
                    href="/"
                    className="bg-primary/90 hover:bg-primary/80 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                    Go Home
                </a> */}
            </div>
        </div>
    );
};

export default NotFound;