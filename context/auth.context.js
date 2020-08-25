import React from 'react'

export const AuthContext = React.createContext({
    token: null,
    userId: null,
    email:'',
    login: ()=>{},
    logot:()=>{},
    isAuthorization:false
});
