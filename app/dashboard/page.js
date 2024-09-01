'use client';
import { useEffect } from 'react';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function Page() {
    const { user, loading, setRedirect } = useAuth();
    const name = user ? user.displayName : '';
    const email = user ? user.email : '';


    const handleSignOut = async () => {
        try {
            // Set the redirect path to home before signing out, so when the user state is updated, they will be redirected to the correct path
            setRedirect('/');
            await signOut(auth);
        } catch (error) {
            console.error("Error during sign-out: ", error);
            // If a user is not signed out successfully, reset the redirect path to default path
            setRedirect(null);
        }
    };

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <button 
                className="bg-sky-400"
                onClick={handleSignOut}
            >
                Sign Out
            </button>
        </div>
    );
}