import {createCookie, decrypt, encrypt, eraseCookie, getCookie} from "../../components/secondary-functions";

export const GET_CART = "GET_CART";
export const ADD_TO_CART_COOKIE = "ADD_TO_CART_COOKIE";
export const ADD_TO_CART_DB = "ADD_TO_CART_DB";
export const DELETE_CART = 'DELETE_CART';



export const getCart = () => {

    return async function(dispatch){
        let user = getCookie('users');
        user = user?decrypt(user):false;

        if(user && user.token){
            const response = await fetch(`${process.env.API_URL}/api/products/cart/${user.userId}`,{
                method:'GET',
                headers:{Authorization: `Bearer ${user.token}`}
            }).catch(err=>console.log(err));
console.log(response)
            if(response.ok){
                const data = await response.json();
                return dispatch({type:GET_CART, payload: data.data})
            }else{
                if(response.status === 401){
                    eraseCookie('users');
                }
                return dispatch({type:GET_CART, payload: null})
            }


        }else{
            let data = getCookie('_pr_c');
            data = data?decrypt(data):null;
            return dispatch({type:GET_CART, payload: data})
        }
    }
};

export const addToCartCookie = (product) => {

    return async function(dispatch){


            let products = getCookie('_pr_c');
            products = products?decrypt(products):[];

            products.push(product);

            await eraseCookie('_pr_c');
            createCookie('_pr_c', encrypt(products));
            return dispatch({type:ADD_TO_CART_COOKIE, payload: products})


    }
};

export const addToCartDb = (product, userId, token) => {

    return async function(dispatch){

        const body = {
            type:product.type,
            buy:'false'
        }


        const response = await fetch(`${process.env.API_URL}/api/products/cart/${userId}/${product.id}`,
            {
                method:'POST',
                body: JSON.stringify(body),
                headers: {Authorization: `Bearer ${token}`}
            }
            ).catch(err=>console.log(err));

        if(response.ok){
            const data = await response.json()

            return dispatch({type:ADD_TO_CART_DB, payload: {...data.data, Product:product.prod}})
        }else{
            if(response.status === 401){
                eraseCookie('users');
            }
            console.log(await response.json())
            return dispatch({type:ADD_TO_CART_DB, payload: null})
        }


    }
};

export const deleteCart = (product) => {

    return async function(dispatch){

        let products = getCookie('_pr_c');
        products = products?decrypt(products):[];

        products.push(product);

        await eraseCookie('_pr_c');
        createCookie('_pr_c', encrypt(products));

        return dispatch({type:DELETE_CART, payload: products})
    }
};
