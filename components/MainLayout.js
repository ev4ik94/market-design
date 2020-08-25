import Head from 'next/head';
import {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {AuthContext} from "../context/auth.context";
import {useAuth} from "../hooks/auth.hook";
import useHttp from "../hooks/http.hook";
import Link from 'next/link';
import {createCookie, getCookie, encrypt, decrypt, eraseCookie} from "./secondary-functions";
import {useCart} from "../hooks/cart.hook";
import {useRouter} from "next/router";


export default function MainLayout({children, title}) {

    const {token, userId, login, logout, ready, email} = useAuth();
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategories] = useState([]);
    const [form, setForm] = useState('signIn');
    const isAuthentication = !!token;
    const {addToCartCookie, getCart, cart} = useCart();

    useEffect(()=>{
        if(!categoryList.length){
            const catCookie = getCookie('categories');
            if(!catCookie){
                getCategories()
            }else{

                setCategories(decrypt(catCookie))
            }

        }

    },[categoryList])

    useEffect(()=>{
        getCart()
    },[getCart]);



    const getCategories = async()=>{

        try{
            setLoading(true);
            await fetch(`${process.env.API_URL}/api/category`, {
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
                })


        }catch(e){

            throw e;
        }
    }

    if(!ready){
        return <p>Loading ...</p>
    }



    return (

        <React.Fragment>

            <Head>
                <title>Admin DashBoard</title>
            </Head>
            <AuthContext.Provider value={{
                token, userId, login, logout, isAuthentication, email
            }}>
            <NavBar categories={categoryList} cartObj={cart} />
            <div style={{paddingTop:'80px'}}>
                {children}
                <FormAuth formToggle={form} toggleFn={setForm}/>
            </div>
                <Footer />
            </AuthContext.Provider>
        </React.Fragment>

    )
}

function FormAuth({formToggle, toggleFn}){

    const [checkBox, setCheck] = useState(false);
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPass,setConfirmPass] = useState('');
    const [error, setError] = useState(false);

    const signIn = async (e)=>{
        e.preventDefault();
        const body = {
            email,
            password
        };

        await request(`${process.env.API_URL}/api/authenticate`,
            'POST',body
            ).then(response=>{
            auth.login(response.data.token, response.data.userId, response.data.login);
            setError(false)
            document.location.reload(true);
        }).catch(err=>{
            setError(err.message)
        })

    }

    const resetPassword = async(e)=>{

        e.preventDefault()
        const body = {
            email
        }

        await request(`${process.env.API_URL}/api/users/forgot-password`,
            'POST',body
        ).then(response=>{

            if(response.success){
                setError(false);
                document.location.reload(true);
            }


        }).catch(err=>{
            setError(err.message)
        })
    }

    useEffect(()=>{
       if(error){
           setError(false);
       }
    },[formToggle])


    const signUp = async (e)=>{

        e.preventDefault();

        if(password===confirmPass){
            const body = {
                email,
                password

            };

            await request(`${process.env.API_URL}/api/users`,
                'POST',body
            ).then(response=>{
                auth.login(response.data.token, response.data.userId, response.data.login);
                setError(false)
                document.location.reload(true);
            }).catch(err=>{
                setError(err.message)
            })


        }else{
            setError("Password does'nt match")
        }

    }

    return(
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {
                        formToggle==='signIn'?(<><div className="modal-header position-relative">
                                <h4 className="modal-title font-weight-bold mx-auto" id="exampleModalLabel">Sign In</h4>
                                <button type="button" className="close position-absolute" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                                <div className="modal-body">
                                    <div className={`${error?'error-block-message d-block':'d-none'}`}>
                                        {error}
                                    </div>
                                    <form className="col-9 mx-auto">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">EMAIL *</label>
                                            <input type="email" className={`${error?'form-control isError':'form-control'}`} id="exampleInputEmail1"
                                                   aria-describedby="emailHelp" onChange={(e)=>setEmail(e.target.value)}/>

                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">PASSWORD *</label>
                                            <input type="password" className={`${error?'form-control isError':'form-control'}`} id="exampleInputPassword1" onChange={(e)=>setPassword(e.target.value)}/>
                                        </div>
                                        <button type="submit" className="btn mx-auto d-block" onClick={signIn}>sign in</button>
                                    </form>

                                    <div className="forgot-pass text-center">

                                        <a href="#" className="text-center" onClick={()=>toggleFn('forgot')}>forgot password</a>

                                    </div>
                                </div>
                                <div className="modal-footer flex-column">
                                    <p className="text-center">Don`t have an account?</p>
                                    <button className="sign-up-btn" onClick={()=>toggleFn('signUp')}>Sign Up</button>
                                </div></>):(formToggle==='signUp'?
                            (<>
                                <div className="modal-header position-relative">
                            <h4 className="modal-title font-weight-bold mx-auto" id="exampleModalLabel">Create your Account</h4>
                            <button type="button" className="close position-absolute" data-dismiss="modal" aria-label="Close" onClick={()=>toggleFn(true)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                            <div className="modal-body">
                                <div className={`${error?'error-block-message d-block':'d-none'}`}>
                                    {error}
                                </div>
                                <form className="col-9 mx-auto">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail2">EMAIL *</label>
                                        <input type="email"
                                               className={`${error?'form-control isError':'form-control'}`}
                                               id="exampleInputEmail2"
                                               aria-describedby="emailHelp"
                                               onChange={(e)=>setEmail(e.target.value)}
                                        />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword2">PASSWORD *</label>
                                        <input type="password"
                                               className={`${error?'form-control isError':'form-control'}`}
                                               id="exampleInputPassword2"
                                               onChange={(e)=>setPassword(e.target.value)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword3">CONFIRM PASSWORD *</label>
                                        <input type="password"
                                               className={`${error?'form-control isError':'form-control'}`}
                                               id="exampleInputPassword3"
                                               onChange={(e)=>setConfirmPass(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group form-check d-flex">
                                        <div className="check-box" onClick={()=>setCheck(!checkBox)}>
                                            {checkBox?<span>✔</span>:''}
                                        </div>
                                        <p className="">
                                            I accept &nbsp;
                                            <Link href="/terms">
                                                <a>Terms of services</a>
                                            </Link>,&nbsp;
                                            <Link href="/privacy-policy">
                                                <a>Privacy policy *</a>
                                            </Link>
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn mx-auto d-block"
                                        onClick={signUp}
                                        disabled={!checkBox}
                                    >sign up</button>
                                </form>


                            </div>
                            <div className="modal-footer flex-column">
                                <button className="sign-up-btn" onClick={()=>toggleFn('signIn')}>Sign In</button>
                            </div></>):(
                                <>
                                <div className="modal-header position-relative">
                                <h4 className="modal-title font-weight-bold mx-auto" id="exampleModalLabel">Forgot Password?</h4>
                                <button type="button" className="close position-absolute" data-dismiss="modal" aria-label="Close" onClick={()=>toggleFn('signIn')}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                                <div className="modal-body">
                                    <div className={`${error?'error-block-message d-block':'d-none'}`}>
                                        {error}
                                    </div>
                                    <form className="col-9 mx-auto">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail3">EMAIL *</label>
                                            <input type="email"
                                                   className={`${error?'form-control isError':'form-control'}`}
                                                   id="exampleInputEmail3"
                                                   aria-describedby="emailHelp"
                                                   onChange={(e)=>setEmail(e.target.value)}
                                            />

                                        </div>

                                        <button
                                            type="submit"
                                            className="btn mx-auto d-block"
                                            onClick={resetPassword}
                                        >send me instructions</button>
                                    </form>


                                </div>
                               </>

                        ))

                    }
                </div>
            </div>
            <style jsx>
                {
                    `
                        .modal-header .close{
                            top:15px;
                            right:15px;
                            font-size: 3rem;
                            font-weight: 400;
                            border:none;
                            outline:none;
                        }
                        
                       
                        .form-control{
                            height:auto;
                            padding: 18px 22px 17px;
                            font-size: 1.2rem;
                            border:1px solid transparent;
                            border-radius:0;
                            letter-spacing: .075em;
                        }
                        
                        .form-control:focus{
                            border:1px solid #000;
                            box-shadow:none;
                        }
                        
                        .form-control:hover{
                            border:1px solid #000;
                        }
                        
                        .isError{
                            border: 1px solid #e01e1e;
                            box-shadow: 1px 1px 10px #e01e1e;
                        }
                        
                        .modal-body label{
                            letter-spacing: .075em;
                        }
                        
                        .modal-body .forgot-pass{
                            padding:20px 10px;
                            text-transform:uppercase;
                            letter-spacing: .075em;
                           
                        }
                        
                        .error-block-message{
                            text-align: center;
                            padding: 10px;
                            color: red;
                       
                        }
                        
                        .modal-body .forgot-pass a{
                            color:#000;
                            text-decoration:underline;
                            transition:all .6s ease;
                           
                        }
                        
                        .modal-body .forgot-pass a:hover{
                            color:#f98e3c;
                        }
                        
                        .modal-body .btn{
                            border-radius: 0;
                            background-color: #f98e3c;
                            border: none;
                            min-width: 264px;
                            max-width: 100%;
                            width: 264px;
                            padding: 22px 28px;
                            color:#fff;
                            font-size: 1.2rem;
                            text-transform: uppercase;
                            line-height: 1.5;
                        }
                        
                        .modal-footer p{
                            font-size:1.2rem;
                            letter-spacing: .075em;
                        }
                        
                        .modal-footer .sign-up-btn{
                            border:none;
                            text-transform:uppercase;
                            text-decoration:underline;
                            transition:all .6s ease;
                            letter-spacing: .075em;
                            outline:none;
                        }
                        
                        .modal-footer .sign-up-btn:hover{
                            color:#f98e3c;
                        }
                        
                        .form-check a{
                            color:#000;
                            text-decoration:underline;
                        }
                        
                        .form-check a:hover{
                            font-weight:bold;
                            text-decoration:none;
                        }
                        
                        .check-box{
                            width: 20px;
                            height: 20px;
                            transition:all .6s ease;
                            cursor:pointer;
                            margin:5px 10px;
                            border: 1px solid transparent;
                        }
                        
                        .check-box:hover{
                            border: 1px solid #000;
                        }
                    `
                }

            </style>
        </div>
    )
}

function NavBar({categories, cartObj}){

    const [categoriesList, setCategories] = useState([]);
    const [cart, setCart] = useState(null);
    const [userName, setUserName] = useState('');
    const [popover, setPop] = useState(false);
    const {token,userId,email} = useContext(AuthContext);
    const router = useRouter();

    useEffect(()=>{
        if(categories.length && categories!==null){
            setCategories(categories);
        }
    }, [categories]);

    useEffect(()=>{
        if(userName===''){

            setUserName(email);
        }
    }, [userName]);

    useEffect(()=>{
        if(cart===null){
            setCart(cartObj);
        }
    }, [cartObj]);



    const elipsisLogin = (login, count=null)=>{

        if(count===null){
            return login.replace(/@\S+/gs, '...');
        }else{
            let arrText = login.split("");
            let newTx = [];
            for(let i=0; i<count; i++){
                newTx.push(arrText[i]);
            }

            return newTx.join("") + '...';
        }

    }

    const signOut = (e)=>{
        e.preventDefault();
        eraseCookie('users');
        document.location.reload(true)

    }





    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-lg-around justify-content-between">
            <div className="navbar-brand">
                <Link href='/'>
                    <a className={router.pathname=='/'?'nav-item active':'nav-item'}>
                        <img src="/vercel.svg" alt="" className="img-contain"/>
                    </a>
                </Link>
            </div>

            <div className="login-cart d-lg-none d-flex position-absolute" style={{right:'90px', top: '7px'}}>
                <Link href="/cart">
                    <a style={{padding:'10px 15px'}} className="position-relative">
                        <div className="icon-cart icon-blck icon-cont-wrap">
                            <img src="/icons/shopping-cart.svg" alt=""/>
                        </div>
                        <div className="count-prds-cart position-absolute">{cart!==null?cart.length:0}</div>
                    </a>
                </Link>

                <div className="user-head icon-blck d-flex position-relative"
                     data-toggle="modal"
                     data-target={`${token&&token!==null?'':'#exampleModal'}`}
                     onMouseEnter={()=>token&&token!==null?setPop(true):''}
                     onMouseLeave={()=>token&&token!==null?setPop(false):''}>
                    <div className="icon-cont-wrap">
                        <img src="/icons/user.svg" alt=""/>
                    </div>
                    <div className={`${popover?'popover-header-user position-absolute show': 'popover-header-user position-absolute hide'}`}>
                        <div className="wrap-header-dropdown">
                            <p className="mb-0 font-weight-bold text-uppercase text-right">{token && userName?elipsisLogin(userName):''}</p>
                            <ul className="pl-0 mb-0">
                                <li className="text-right">
                                    <Link href='/'>
                                        <a title="Account details">Account details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/'>
                                        <a title="Billing details">Billing details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/'>
                                        <a title="Purchase history">Purchase history</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <a title="Sign out" href="#!" onClick={signOut}>Sign out</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>




            <div className="collapse navbar-collapse col-lg-7 justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    {
                        (categoriesList || []).map(item=>{
                            let path = `/${item.slug}`;
                            return(
                                <li key={item.id} className={router.pathname==path?'nav-item active':'nav-item'}>
                                    <Link href={path}>
                                        <a className="nav-link" title={item.title}>
                                            {item.title}
                                        </a>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className="login-cart d-lg-flex d-none justify-content-between">
                <Link href="/cart">
                    <a style={{padding:'10px 15px'}} className="position-relative">
                        <div className="icon-cart icon-blck icon-cont-wrap">
                            <img src="/icons/shopping-cart.svg" alt=""/>
                        </div>
                        <div className="count-prds-cart position-absolute">{cart!==null?cart.length:0}</div>
                    </a>
                </Link>

                <div
                    className="user-head icon-blck d-flex position-relative"
                     data-toggle="modal"
                     data-target={`${token&&token!==null?'':'#exampleModal'}`}
                    onMouseEnter={()=>token&&token!==null?setPop(true):''}
                    onMouseLeave={()=>token&&token!==null?setPop(false):''}

                >
                    <div className="icon-cont-wrap">
                        <img src="/icons/user.svg" alt=""/>
                    </div>
                    <p className="mb-0" style={{lineHeight:'3'}}>{token && userName?elipsisLogin(userName, 7):'SIGN IN'}</p>

                    <div className={`${popover?'popover-header-user position-absolute show':'popover-header-user position-absolute hide'}`}>
                        <div className="wrap-header-dropdown">
                            <p className="mb-0 font-weight-bold text-uppercase text-right">{token && userName?elipsisLogin(userName):''}</p>
                            <ul className="pl-0 mb-0">
                                <li className="text-right">
                                    <Link href='/'>
                                        <a title="Account details">Account details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/'>
                                        <a title="Billing details">Billing details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/'>
                                        <a title="Purchase history">Purchase history</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <a title="Sign out" href="#!" onClick={signOut}>Sign out</a>
                                </li>
                            </ul>
                        </div>
                    </div>


                </div>

            </div>





            <style jsx>
                {
                    `
                        .navbar{
                            position:fixed;
                            top:0;
                            left:0;
                            right:0;
                            background-color:#ffff;
                            z-index:4;
                            border-bottom:1px solid #f2ede8;
                        }
                        
                        .nav-item a{
                            color: #000;
                            text-decoration: none;
                            text-transform: uppercase;
                            font-size: 1rem;
                            line-height: 32px;
                            display: inline-block;
                            letter-spacing: .075em;
                            padding: 10px;
                            
                        }
                        
                        .nav-item a:before{
                            content: attr(title);
                            display:block;
                            font-weight:bold;
                            height: 0;
                            overflow: hidden;
                            visibility: hidden;
                            
                        }
                        
                        .active a{
                            font-weight:bold;
                        }
                        
                        .nav-item a:hover{
                            font-weight:bold;
                        }
                        
                        .icon-cont-wrap{
                            width:25px;
                        }
                        
                        .navbar-brand{
                            width:130px;
                        }
                        
                        .count-prds-cart{
                            border-radius: 50%;
                            background: #f98e3c;
                            color: #fff;
                            font-size: 13px;
                            width: 23px;
                            height: 23px;
                            line-height: 28px;
                            text-align: center;
                            top:0;
                            right:0;
                        }
                        
                        .icon-blck{
                            cursor:pointer;
                            opacity:.6;
                        }
                        
                        .icon-blck:hover{
                            opacity:1;
                        }
                        
                        .popover-header-user {
                            background:#fff;
                            top:100%;
                            right:-20px;
                            padding:10px;
                            max-width:200px;
                            width:200px;
                            transition: all .2s ease;
                            
                        }
                        
                        .user-head .show{
                            opacity:1!important;
                            display:block!important;
                        }
                        
                        .user-head .hide{
                            opacity:0;
                            display:none;
                        }
                        
                        .popover-header-user li{
                            padding:10px 5px;
                        }
                        
                        .popover-header-user p{
                            letter-spacing: .075em;
                        }
                        
                        .popover-header-user a{
                            color:#000;
                            letter-spacing: .075em;
                            text-decoration: none;
                           
                        }
                        
                        .popover-header-user a:before{
                            content:attr(title);
                            font-weight:bold;
                            visibility:hidden;
                            letter-spacing: .075em;
                            overflow: hidden;
                            height:0;
                            display:block;
                        }
                        
                        .popover-header-user a:hover{
                            font-weight:bold;
                        }
                        
                        
                       
                        
                        @media screen and (max-width: 990px){
                            .popover-header-user{
                                right:80px;
                            }
                        }
                        
                        
                        
                        
                    `
                }
            </style>
        </nav>
    )
}

function Footer() {
    return(
        <div className="container-fluid" style={{marginTop:'100px'}}>
           <div className="footer-nav-links d-flex flex-lg-row flex-md-row flex-column">
               <div className="brand-icon col-12 col-lg-3 col-md-3 mb-5">
                    <div className="cont-img" style={{width:'150px'}}>
                        <img src="/vercel.svg" alt=""/>
                    </div>
               </div>
               <div className="links-foot col-12 col-lg-9 col-md-9 d-flex">
                   <div className="site-links col-lg-6 col-sm-4">
                       <ul className="pl-0">
                           <li>
                               <Link href="/company">
                                   <a className="nav-link text-uppercase" title="about company">
                                       about company
                                   </a>
                               </Link>
                           </li>
                           <li>
                               <Link href="/company">
                                   <a className="nav-link text-uppercase" title="privacy policy">
                                       privacy policy
                                   </a>
                               </Link>
                           </li>
                           <li>
                               <Link href="/company">
                                   <a className="nav-link text-uppercase" title="terms of services">
                                       terms of services
                                   </a>
                               </Link>
                           </li>
                           <li>
                               <Link href="/company">
                                   <a className="nav-link text-uppercase" title="licenses">
                                       licenses
                                   </a>
                               </Link>
                           </li>
                           <li>
                               <Link href="/company">
                                   <a className="nav-link text-uppercase" title="payments">
                                       payments
                                   </a>
                               </Link>
                           </li>

                       </ul>
                   </div>
                   <div className="social-links col-lg-6 col-sm-4">
                       <ul className="pl-0">
                           <li>
                               <p className="font-weight-bold text-uppercase mb-0" style={{padding:'.5rem 1rem'}}>social</p>
                           </li>
                           <li>

                               <a href="#" className="nav-link text-uppercase" title="instagram">
                                   instagram
                               </a>

                           </li>
                           <li>
                               <a href="#" className="nav-link text-uppercase" title="pinterest">
                                   pinterest
                               </a>
                           </li>
                           <li>
                               <a href="#" className="nav-link text-uppercase" title="facebook">
                                   facebook
                               </a>
                           </li>


                       </ul>
                   </div>
               </div>
           </div>
            <div className="bottom-foot">
                <ul className="pl-0 d-flex justify-content-center">
                    <li><img src="/icons/visa.svg" alt=""/></li>
                    <li><img src="/icons/mastercard.svg" alt=""/></li>
                </ul>
            </div>

            <style jsx>{
                `
                    .nav-link{
                    
                        font-size:.9rem;
                    }
                    .site-links .nav-link{
                        color:#000;
                    }
                    .social-links .nav-link{
                        color:#8e8e8e;
                    }
                    
                    .nav-link:hover{
                        font-weight:bold;
                    }
                    
                    .nav-link:before{
                        content:arr(title);
                        font-weight:bold;
                        height:0;
                        display:block;
                        overflow:hidden;
                    }
                    
                    .bottom-foot li{
                        width:50px;
                        margin:10px;
                    }
                    
                    @media screen and (max-width: 767px) {
                        .site-links,.site-links .nav-link {
                            padding-left:0;
                        }
                        
                        .nav-link,p{
                            font-size:.8rem;
                        }
                    }
                    
                    @media screen and (max-width: 400px) {
                      
                        .nav-link,p{
                            font-size:.65rem;
                        }
                    }
                
                `
            }</style>
        </div>
    )
}







