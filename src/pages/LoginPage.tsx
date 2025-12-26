const API_URL = import.meta.env.VITE_API_URL;

export const LoginPage = () => {
    const handleGoogleLogin = () => {
        // Redirect to backend OAuth2 authorization endpoint 
        // ** (don't try to find the actual controller or endpoint in the backend code, 
        // it is handled by Spring Security automatically as soon as you configure OAuth2 client in application.properties or application.yml;))
        window.location.href = `${API_URL}/oauth2/authorization/google-calendar`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br 
            from-bg-light to-bg-light/30 dark:from-bg-dark dark:to-bg-dark/20">
            {/* Gradient overlay */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute flex items-end text-black -top-[30%] left-1/2 w-50 h-96 rotate-10 bg-primary/25 rounded-full blur-2xl" >
                    <h1 className="mt-auto">
                        hehiasdf
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, modi?
                    </h1>
                </div>
                <div className="absolute -bottom-[45%] left-1/6 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 backdrop-blur-[5px] bg-surface-light/20 dark:bg-surface-dark/20 
                rounded-2xl shadow-lg p-8 w-full max-w-md border border-border-light dark:border-border-dark">
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-primary/20 rounded-2xl 
                            flex items-center justify-center">
                            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
                        Welcome to Shery Calendar
                    </h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark">
                        Manage your events seamlessly
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 
                            bg-white/20 dark:bg-surface-dark/20 border border-border-light dark:border-border-dark 
                            text-text-light dark:text-text-dark px-6 py-3 rounded-lg font-semibold 
                            hover:bg-gray-50 dark:hover:bg-surface-dark/80 
                            hover:border-primary/50 dark:hover:border-primary/50 
                            transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};
