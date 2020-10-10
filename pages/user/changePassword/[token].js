import Head from 'next/head'
import {useState, useEffect} from 'react'
import {useRouter} from "next/router";
import useHttp from "../../../hooks/http.hook";
import MainLayout from "../../../components/MainLayout";
import Preloader from "../../../components/Preloader";
import Error from "../../../components/Error";


export default function ChangeForm({token: serverToken, serverErr}) {

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState(null);
    const [errorC, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form,setForm] = useState(false);
    const {query} = useRouter()
    const {request} = useHttp();


    useEffect(()=>{
        if(!serverToken) checkToken();

        if(serverErr===null){
            if(serverToken && serverToken.record){
                setEmail(serverToken.record.email);
            }

            if(serverToken){
                setForm(serverToken.showForm);
                if(!serverToken.showForm){
                    setError(serverToken.message|| 'Something went wrong. Try again');
                }
            }
        }

    }, [serverToken])

    useEffect(()=>{
        if(serverError!==null){
            if(serverError===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }
        }
    }, [serverErr])

    const checkToken = async()=>{

        await request(`${process.env.API_URL}/api/users/reset-password?token=${query.token}`,
            'GET').then(result=>{
            setError(false)
        }).catch(err=>{
            setError(err.message)
        })

    }

    const submitForm = async (e)=>{
        e.preventDefault()
        const body = {
            password1,
            password2,
            email,
            token: query.token
        };

        await request(`${process.env.API_URL}/api/users/reset-password?token=${query.token}`,
            'POST', body)
            .then(result=>{
                if(result.success){
                    setSuccess(true);
                    setTimeout(()=>{
                        setSuccess(false);
                        document.location = process.env.API_URL;
                    }, 3000);
                    setPassword1('');
                    setPassword2('');
                }
                setError(false)
        }).catch(err=>{
            setError(err.message)
        })

    }

    if(loading){
        return(<Preloader />)
    }


    return (
        <MainLayout>
            <div className="container">
            {

                form?(
                    <form className="col-6 mx-auto pt-5">
                        <div className={success?'alert alert-success show':'alert alert-success fade'} role="alert">
                            Password was changed successfully!
                        </div>
                        <h4 className="text-center font-weight-bold pb-3">Enter a new password</h4>
                        <div className={`${errorC?'error-block-message d-block':'d-none'}`}>
                            {errorC}
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword-reset">PASSWORD *</label>
                            <input type="password" className={`${errorC?'form-control isError':'form-control'}`} id="exampleInputPassword-reset" onChange={(e)=>setPassword1(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword-reset2">CONFIRM PASSWORD *</label>
                            <input type="password" className={`${errorC?'form-control isError':'form-control'}`} id="exampleInputPassword-reset2" onChange={(e)=>setPassword2(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn mx-auto d-block" onClick={submitForm}>Save</button>
                    </form>
                ):( <div className={`${errorC?'error-block-message d-block':'d-none'}`}>
                    {errorC}
                </div>)
            }
            <style jsx>
                {
                    `
                                               
                        .form-control{
                            height:auto;
                            padding: 18px 22px 17px;
                            font-size: 1.2rem;
                            border:1px solid transparent;
                            border-radius:0;
                            letter-spacing: .075em;
                            border:1px solid #000;
                        }
                        
                        .form-control:focus{
                            border:1px solid #000;
                            box-shadow:none;
                        }
                        
                       
                        .isError{
                            border: 1px solid #e01e1e;
                            box-shadow: 1px 1px 10px #e01e1e;
                        }
                        
                        label{
                            letter-spacing: .075em;
                        }
                        
                                                
                        .error-block-message{
                            text-align: center;
                            padding: 10px;
                            color: red;
                       
                        }
                        
                        
                      
                        .btn{
                            border-radius: 0;
                            background-color: #f98e3c;
                            border: none;
                            min-width: 200px;
                            max-width: 100%;
                            width: 200px;
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
        </MainLayout>
    )
}


export async function getServerSideProps(ctx){

    const response = await fetch(`${process.env.API_URL}/api/users/reset-password?token=${ctx.query.token}`)

    if(!response.ok){
        return {
            props:{token:null, serverErr:response.status}
        }
    }
    const post = await response.json()


    return {
        props:{token:post, serverErr:null}
    }
}
