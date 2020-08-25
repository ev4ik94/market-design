import {useState, useCallback, useEffect} from 'react';
import {createCookie, getCookie, eraseCookie, encrypt} from "../components/secondary-functions";
import crypto from "crypto";

export const useAuth = ()=>{

    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState('');

    const login = useCallback((token, userId, login)=>{

        setToken(token);
        setUserId(userId);
        setEmail(login);

        createCookie('users', encrypt({token,userId,login}));
    }, []);

    const logout = useCallback(()=>{
        setToken(null);
        setUserId(null);

        eraseCookie('users');
    }, []);

    useEffect(()=>{
        let data = getCookie('users');
        data = data?data:false;

        if(data){

            let dt = data.replace(/"/g, '');
            const decipher = crypto.createDecipher('aes128','41f733');
            let decrypted = decipher.update(dt,'hex', 'utf8');
            decrypted += decipher.final('utf8');

            let response = JSON.parse(decrypted);
            if(response && response.token){
                login(response.token, response.userId, response.login);
            }

        }

        setReady(true);
    }, [login])


    return {token, userId, email, login, logout, ready};

};
