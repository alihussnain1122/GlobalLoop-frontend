import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext= createContext();
const AuthProvider= ({children})=>{
    const [user, setUser]= useState(null);
    useEffect(()=>{
        const token= localStorage.getItem("token");
        if(token){
            const decoded= jwtDecode(token);
            setUser({...decoded, token});
        }
    },[]);
    return(
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
