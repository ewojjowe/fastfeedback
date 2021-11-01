import React, { useState, useEffect, useContext, createContext } from 'react';
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";

import firebaseApp from './firebase';
import { createUser } from './db';

const provider = new GithubAuthProvider();

const authContext = createContext();

export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const auth = getAuth(firebaseApp);
    
    const handleUser = async (rawUser) => {
        if (rawUser && rawUser.user) {
            const user = await formatUser(rawUser)

            createUser(user.uid, user)
            setUser(user);
            return user;
        } else {
            setUser(false);
            return false;
        }
    }

    const signinWithGithub = () => {
        return signInWithPopup(auth, provider)
            .then((result) => {
                handleUser(result)
            });
    };

    const signout = () => {
        return signOut(auth)
            .then(() => {
                handleUser(false)
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, handleUser);

        return () => unsubscribe();
    }, []);

    return {
        user,
        signinWithGithub,
        signout
    };
}

const formatUser = (rawUser) => {
    const {
        uid,
        email,
        displayName,
        providerData,
        photoURL: photoUrl
    } = rawUser.user
    const provider = providerData[0].providerId

    return {
        uid,
        email,
        displayName,
        provider,
        photoUrl
    };
  };