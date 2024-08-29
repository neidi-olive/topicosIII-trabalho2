import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

function AuthProvider({children})
{
    const [session, setSession] = useState(null);

    // function contextSession(session){
    //     setSession(session);
    //     console.log("Context FOI")
    // }

    const contextSession = (session) => {
        console.log('Context FOI')
    }

    return (
        <AuthContext.Provider value={{ session, contextSession }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;