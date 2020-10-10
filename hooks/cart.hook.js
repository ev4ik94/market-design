import {useState, useCallback, useEffect} from 'react';
import {createCookie, getCookie, eraseCookie, decrypt, encrypt} from "../components/secondary-functions";
import useHttp from './http.hook';

export const useCart = ()=>{

    const [ready, setReady] = useState(false);
    const {request} = useHttp();
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);


    const addToCartCookie = useCallback(async(product)=>{

        let products = getCookie('_pr_c');
        products = products?decrypt(products):[];

        products.push(product);
        setCart(products);
        await eraseCookie('_pr_c');
        createCookie('_pr_c', encrypt(products));

    }, []);

    const addToCartSave = useCallback(async(token,userId,product)=>{

        const body = {type:product.type}

        await request(`${process.env.API_URL}/api/products/cart/${userId}/${product.id}`,
            'POST', body, {
            Authorization: `Bearer ${token}`
        }).then((result)=>{
            setError(null)

        })
            .catch(err=>setError(err.message));

        return true;
    }, []);


    const getCart = useCallback(async()=>{

        let user = getCookie('users');
        user = user?decrypt(user):false;

        if(user && user.token){
            await request(`${process.env.API_URL}/api/products/cart/${user.userId}`,
                'GET', null, {
                    Authorization: `Bearer ${user.token}`
                })
                .then(result=> {
                        console.log(result)
                        setCart(result.data)
                    }
                )
                .catch(err=>console.log(err));
        }else{
            let data = getCookie('_pr_c');
            data = data?decrypt(data):null;
            setCart(data);
        }



    }, []);




    return {addToCartCookie, addToCartSave, ready, getCart, cart, error};

};
