import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import {AuthContext} from "../context/auth.context";
import {useAuth} from "../hooks/auth.hook";
import {createCookie, getCookie, encrypt, decrypt} from "./secondary-functions";


/*---Components---*/

import {PreloaderComp} from './Preloader';
import {FormAuth} from './main-components/FormAuth';
import {NavBar} from './main-components/NavBar';
import {Footer} from './main-components/Footer';

/*---Redux---*/

import {connect} from 'react-redux';
import {getCart} from '../redux/actions/actionCart';


function MainLayout({children, title, cart, getCart}) {

    const {token, userId, login, logout, ready, email} = useAuth();
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategories] = useState([]);
    const [form, setForm] = useState('signIn');
    const isAuthentication = !!token;
    const [mountCart, setMountCart] = useState(true);
    const [mountCat, setMountCat] = useState(true);


    useEffect(()=>{
        if(mountCart){
            getCart();
            setMountCart(false);
        }
    }, [mountCart]);

    useEffect(()=>{
        if(mountCat){
            const catCookie = getCookie('categories');
            if(!catCookie){
                getCategories();
            }else{
                setCategories(decrypt(catCookie));
            }
            getCart();

            setMountCat(false)
        }


    },[mountCat])



    const getCategories = async()=>{

        try{
            setLoading(true);
            await fetch(`https://ec2-54-155-87-214.eu-west-1.compute.amazonaws.com/api/category`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                body:null
            })
                .then(result=>{
                    if(!result.ok){
                        throw new Error('Something went wrong');
                    }
                    return result.json();
                })
                .then(result=>{

                    createCookie('categories', encrypt(result.data))
                    setCategories(result.data);
                    setLoading(false);
                }).catch(err=>console.log(err.message))


        }catch(e){

            throw e;
        }
    }

    if(!ready){
        return (<PreloaderComp />)
    }


    return (

        <React.Fragment>

            <Head>
                <title>Admin DashBoard</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <AuthContext.Provider value={{
                token, userId, login, logout, isAuthentication, email
            }}>
            <NavBar categories={categoryList} cartObj={cart && cart.cart?cart.cart:[]} />
            <div style={{paddingTop:'9vh'}}>
                {children}
                <FormAuth formToggle={form} toggleFn={setForm}/>
            </div>
                <Footer />
            </AuthContext.Provider>
        </React.Fragment>

    )
}

const mapStateToProps = state => ({
    cart: state
});

const mapDispatchToProps = {
    getCart
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);















