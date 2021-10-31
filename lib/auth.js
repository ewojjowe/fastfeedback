import React, { useState, useEffect, useContext, createContext } from 'react';
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import firebaseApp from './firebase';

const provider = new GithubAuthProvider();

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const auth = getAuth(firebaseApp);

    const signinWithGithub = () => {
        return signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                setUser(user);
                return user;
            });
    };

    const signout = () => {
        return signOut(auth)
            .then(() => {
                setUser(false);
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        user,
        signinWithGithub,
        signout
    };
}