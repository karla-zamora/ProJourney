'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirectPath, setRedirectPath] = useState(null); // Default redirect path is null
    const router = useRouter();
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);

            // Redirect the user if they are singed in and redirectPath is set
            if (user && redirectPath) {
                router.push(redirectPath);
                setRedirectPath(null); // Reset to default after redirect
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [router, redirectPath]);

    // Function to set redirect path dynamicaly
    const setRedirect = (path) => setRedirectPath(path);

    return (
        <AuthContext.Provider value={{ user, loading, setRedirect }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);