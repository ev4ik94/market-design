import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/auth.context";
import {useRouter} from "next/router";
import {eraseCookie} from "../secondary-functions";
import Link from "next/link";

export function NavBar({categories, cartObj}){

    const [categoriesList, setCategories] = useState([]);
    const [userName, setUserName] = useState('');
    const [popover, setPop] = useState(false);
    const {token,email} = useContext(AuthContext);
    const router = useRouter();

    useEffect(()=>{
        if(categories.length && categories!==null){
            setCategories(categories);
        }
    }, [categories]);

    useEffect(()=>{
        if(userName==='')setUserName(email);
    }, [userName]);



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
        <nav className="navbar navbar-expand-lg navbar-light bg-white justify-content-lg-around justify-content-between">
            <div className="navbar-brand">
                <Link href='/'>
                    <a className={router.pathname=='/'?'nav-item active':'nav-item'}>
                        <img src="/icons/peelpic.svg" alt="" className="img-contain"/>
                    </a>
                </Link>
            </div>

            <div className="login-cart d-lg-none d-flex position-absolute" style={{right:'90px', top: '7px'}}>
                <Link href="/checkout">
                    <a style={{padding:'10px 15px'}} className="position-relative">
                        <div className="icon-cart icon-blck icon-cont-wrap">
                            <img src="/icons/shopping-cart.svg" alt=""/>
                        </div>
                        <div className="count-prds-cart position-absolute">{cartObj.length}</div>
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
                                    <Link href='/user'>
                                        <a title="Account details">Account details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/user/billing'>
                                        <a title="Billing details">Billing details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/user/history'>
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
                <Link href="/checkout">
                    <a style={{padding:'10px 15px'}} className="position-relative">
                        <div className="icon-cart icon-blck icon-cont-wrap">
                            <img src="/icons/shopping-cart.svg" alt=""/>
                        </div>
                        <div className="count-prds-cart position-absolute">{cartObj.length}</div>
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
                                    <Link href='/user'>
                                        <a title="Account details">Account details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/user/billing'>
                                        <a title="Billing details">Billing details</a>
                                    </Link>
                                </li>
                                <li className="text-right">
                                    <Link href='/user/history'>
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
                            height: 50px;
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
                        
                        @media screen and (max-width: 350px){
                            .navbar-brand{
                               width:110px;
                            }
                        }
                        
                        
                        
                        
                    `
                }
            </style>
        </nav>
    )
}
