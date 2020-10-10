import Head from 'next/head'
import {useState, useEffect, useRef} from 'react'
import MainLayout from '../../components/MainLayout';
import useHttp from '../../hooks/http.hook';
import Link from "next/link";
import {getCookie, decrypt, createCookie, encrypt} from "../../components/secondary-functions";
import { useRouter } from 'next/router';
import {useAuth} from "../../hooks/auth.hook";
import NavUsers from '../../components/user/navUser';
import Preloader from "../../components/Preloader";
import Error from "../../components/Error";


export default function Billing({users:serverUser, serverErr}) {

    const {request, loading} = useHttp();
    const [mount, setMount] = useState(true);
    const {token, userId, email, logout} = useAuth();
    const [toggleForm, setFormToggle] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [hasAddress, setAddress] = useState(null);


    const changeForm = useRef(null);

    const toggleFormEdit = ()=>{

        let formEl = document.getElementById('form-address-user');

        if(!toggleForm){
            changeForm.current.style = `height:${formEl.offsetHeight+90}px`;
        }else{
            changeForm.current.style = `height:''`;
        }

        setFormToggle(!toggleForm)
    };

    useEffect(()=>{

        if(mount){
            if(!serverUser){
                if(token && token!==null){
                    getUser();
                }
            }
            else{
                if(serverErr===null) setParams(serverUser);
                else{
                    if(serverErr===401) logout();
                    setError(serverErr)
                }


            }
            setMount(false);
        }

    }, [mount])

    useEffect(()=>{
        if(serverError!==null){
            if(serverError===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }
        }
    }, [serverErr])

    const getUser = async()=>{
        await request(`${process.env.API_URL}/api/users/${userId}`)
            .then(result=>{
                if(result.data){

                    setParams(result)
                }
            })
    };

    const setParams = (result)=>{
        let addArr = [];

        if(result.data.Address && result.data.Address!==null){

            for(let val in result.data.Address){

                addArr.push(result.data.Address[val]);
            }
        }


        setAddress(addArr.length?addArr.join(', '):null);
        setFormToggle(addArr.length?false:true);
        setCity(result.data.Address? result.data.Address.city:'');
        setCountry(result.data.Address? result.data.Address.country:'');
        setProvince(result.data.Address? result.data.Address.province:'');
        setPostalCode(result.data.Address? result.data.Address.postal_code:'');
        setStreet(result.data.Address? result.data.Address.street:'');
    }

    const saveAddress = async()=>{

        const body = {
            city,
            country,
            province,
            postal_code:postalCode,
            street
        };

        if(hasAddress!==null){

            await request(`${process.env.API_URL}/api/address/${userId}`, 'PUT', body, {
                Authorization: `Bearer ${token}`
            })
                .then(()=>{
                    setError('');
                    setParams({data:{Address:body}})
                    toggleFormEdit()
                })
                .catch(err=>setError(err.message))
        }else{

            await request(`${process.env.API_URL}/api/address/${userId}`, 'POST', body, {
                Authorization: `Bearer ${token}`
            })
                .then(()=>{
                    setError('');
                    setParams({data:{Address:body}})
                    toggleFormEdit()
                })
                .catch(err=>setError(err.message))
        }


    }

    if(loading){
        return(<Preloader />)
    }



    return (
        <MainLayout title={'Title'}>
            {
                token && token!==null?(
                    <>
                        <NavUsers />
                        <div className="container">
                            <div className="title-head">
                                <h1 className="font-weight-bold text-center text-uppercase">{email && email!==null?email:''}</h1>
                            </div>
                            {
                                error!==''?(<div className="error-message mb-3">
                                    <p className="text-center mb-0">{error}</p>
                                </div>):''
                            }
                            <div className={`form-user-content mt-5 col-6 ${!toggleForm?'hidden-form':''}`} ref={changeForm}>
                                <form id="form-address-user">
                                    <div className="form-group">
                                        <label htmlFor="streetInp">street address</label>
                                        <input type="text"
                                               className="form-control"
                                               id="streetInp"
                                               aria-describedby="emailHelp"
                                               value={street}
                                               onChange={(e)=>setStreet(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cityInp">city</label>
                                        <input type="text"
                                               className="form-control"
                                               id="cityInp"
                                               value={city}
                                               onChange={(e)=>setCity(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="provinceInp">state/province</label>
                                        <input type="text"
                                               className="form-control"
                                               id="provinceInp"
                                               value={province}
                                               onChange={(e)=>setProvince(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="surNameUserContent">zip/postal code</label>
                                        <input type="text"
                                               className="form-control"
                                               id="surNameUserContent"
                                               value={postalCode}
                                               onChange={(e)=>setPostalCode(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="surNameUserContent">country</label>
                                        <input type="text"
                                               className="form-control"
                                               id="surNameUserContent"
                                               value={country}
                                               onChange={(e)=>setCountry(e.target.value)}
                                        />
                                    </div>

                                </form>


                                <button className="btn text-uppercase" onClick={saveAddress}>save</button>
                            </div>
                            <div className="block-address-info mt-5 col-5">
                                {
                                    hasAddress !==null ?(<div className="address-users-inf d-flex">

                                        <div>
                                            <p className="font-weight-bold" style={{color:'#000'}}>Billing information</p>
                                            <p>{hasAddress}</p>
                                        </div>
                                        <button className="text-uppercase" onClick={toggleFormEdit}>edit</button>
                                    </div>):('')
                                }

                            </div>
                        </div>
                    </>
                ):(<div style={{minHeight:'400px'}}>
                    <div className="title-head col-6 mx-auto">
                        <h1 className="font-weight-bold text-center mb-0 mt-5">ACCESS DENIED</h1>
                    </div>
                    <p className="text-center mt-3">You are not authorized to access this page.</p>
                </div>)
            }

            <style jsx>
                {
                    `
                      .title-head{
                        padding:10px;
                        border-bottom:1px solid #f2ede8;
                      }
                      
                      .change-pass-btn{
                        background-color:transparent;
                        border:none;
                        outline:none;
                        letter-spacing:.05rem;
                        text-decoration:underline;
                      }
                      
                      .change-pass-btn:hover{
                        text-decoration:none;
                      }
                      
                      .form-change-pass{
                        height:0;
                        overflow:hidden;
                        transition:all .4s ease;
                      }
                      
                      .btn{
                        background-color:transparent;
                        border:1px solid #000;
                        transition:all .4s ease;
                        border-radius:0;
                        padding:15px 40px;
                        color:#000;
                        float:right;
                      }
                      
                      .btn:hover{
                        background-color:#000;
                        color:#fff;
                      }
                      
                      .block-address-info button{
                        color:#fff;
                        background-color:#f98e3c;
                        border:none;
                        outline:none;
                        padding: 15px 50px;
                        font-size: 1.2rem;
                        align-self:flex-end;
                      }
                      
                      .address-users-inf{
                        border:1px solid #e8e8e8;
                        flex-direction:column;
                      }
                      
                      .address-users-inf > div{
                        padding:10px;
                      }
                      
                      .address-users-inf > div p:first-child{
                        font-size:1.4rem;
                      }
                      
                      .address-users-inf > div p:last-child{
                        font-size:1.2rem;
                      }
                      
                      .hidden-form{
                        height:0;
                        
                      }
                      
                      .form-user-content{
                        transition:all .4s ease;
                        overflow:hidden;
                      }
                                      
                  
                  `
                }
            </style>
        </MainLayout>
    )
}


export async function getServerSideProps(ctx){

    if(ctx.req.headers.cookie){
        let cookie = ctx.req.headers.cookie.split(';').filter(item=>item.indexOf('users')>0);
        let ind = cookie.length && cookie[0].indexOf('=')>0?cookie[0].indexOf('='):null;

        if(cookie.length && ind!==null){
            let users = decrypt(cookie[0].slice(ind+1));
            let error = null;
            const response = await fetch(`${process.env.API_URL}/api/users/${users.userId}`, {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${users.token}`
                }
            })
                .catch(err=>err)

            if(await response.status>201){
                error = response.status;
            }

            const user = await response.json();

            return {
                props:{users:user, serverErr: error}
            }
        }

    }
    return {
        props:{users:null}
    }


}


