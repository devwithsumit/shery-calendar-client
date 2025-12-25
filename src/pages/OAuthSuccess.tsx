import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setToken, setUser } from "@/store/userSlice";
import { useGetCurrentUserQuery } from "@/api/authApi";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = new URLSearchParams(window.location.search);

    let token = params.get("token");
    const calendarConnected = params.get("calendar_connected") === "true";

    // Only Testing: Fallback to localStorage if token is not in URL
    // const localStorageToken = localStorage.getItem("sc_token");
    // if (!token && localStorageToken) {
    //     token = localStorageToken;
    // }

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        dispatch(setToken({ token }));
    }, [token, dispatch, navigate]);

    const { data: user, isError } = useGetCurrentUserQuery(undefined, {
        skip: !token,
    });
    useEffect(() => {
        if (user) {
            // Allow login even without calendar connected
            // if (!calendarConnected) {
            //     // User is logged in but calendar not connected
            //     return;
            // }
            dispatch(setUser({ user }));
            navigate("/calendar", { replace: true });
        }

        if (isError) {
            navigate("/login", { replace: true });
        }
    }, [user, isError, navigate, calendarConnected]);

    // Show error page if user is logged in but calendar not connected
    // COMMENTED OUT: Allow users to access app without calendar permissions
    // if (user && !calendarConnected) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-linear-to-br 
    //             from-bg-light to-bg-light/30 dark:from-bg-dark dark:to-bg-dark/20">
    //             <div className="fixed inset-0 pointer-events-none">
    //                 <div className="absolute -top-[40%] left-1/2 w-96 h-96 bg-red-500/25 rounded-full blur-3xl" />
    //                 <div className="absolute -bottom-[45%] right-1/4 w-96 h-96 bg-red-500/25 rounded-full blur-3xl" />
    //             </div>

    //             <div className="relative backdrop-blur-[10px] bg-surface-light/80 dark:bg-surface-dark/80 
    //                 rounded-2xl shadow-2xl p-12 w-full max-w-md border border-border-light dark:border-border-dark
    //                 text-center">
    //                 <div className="flex justify-center mb-6">
    //                     <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
    //                         <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
    //                         </svg>
    //                     </div>
    //                 </div>

    //                 <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
    //                     Calendar Not Connected
    //                 </h2>
    //                 <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
    //                     You need to grant calendar permissions to use this application.
    //                 </p>

    //                 <button
    //                     onClick={() => navigate("/login", { replace: true })}
    //                     className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
    //                 >
    //                     Retry Login with Permissions
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br 
            from-bg-light to-bg-light/30 dark:from-bg-dark dark:to-bg-dark/20">
            {/* Gradient overlay */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-[40%] left-1/2 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-[45%] right-1/4 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
            </div>

            <div className="relative backdrop-blur-[10px] bg-surface-light/80 dark:bg-surface-dark/80 
                rounded-2xl shadow-2xl p-12 w-full max-w-md border border-border-light dark:border-border-dark
                text-center">
                {/* Animated spinner */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>

                <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-2">
                    Authenticating...
                </h2>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                    Please wait while we log you in
                </p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
