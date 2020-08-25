import{useState,useCallback, useContext} from 'react';
import {AuthContext} from "../context/auth.context";
import {useAuth} from "./auth.hook";

export default function useHttp(){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {logout} = useAuth();

    const request = useCallback(async (url,method='GET', body=null, headers={}, signal=null)=>{

        setLoading(true);

        try{
            if(body){
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, {
                method,headers,body,signal
            });

            const data = await response.json();

            if(!response.ok){

                if(response.status===401){
                    logout();
                }
                throw new Error(data.message || 'Something went wrong');
            }

            setLoading(false);

            return data;
        }catch(e){
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [logout]);

    const clearError = useCallback(()=>setError(null), []);

    return {loading, request, error, clearError};

}