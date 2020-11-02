import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/auth.context";
import useHttp from "../../hooks/http.hook";
import Link from "next/link";

export function FormAuth({formToggle, toggleFn}){

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

    const resetForm = ()=>{
        setError(false)
        setEmail('')
        setPassword('')
    }

    return(
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {
                        formToggle==='signIn'?(<><div className="modal-header position-relative">
                            <h4 className="modal-title font-weight-bold mx-auto" id="exampleModalLabel">Sign In</h4>
                            <button type="button" className="close position-absolute" data-dismiss="modal" aria-label="Close" onClick={resetForm}>
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
                                        <input
                                            type="email"
                                            className={`${error?'form-control isError':'form-control'}`}
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            value={email}
                                            onChange={(e)=>setEmail(e.target.value)}/>

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">PASSWORD *</label>
                                        <input
                                            type="password"
                                            className={`${error?'form-control isError':'form-control'}`}
                                            id="exampleInputPassword1"
                                            value={password}
                                            onChange={(e)=>setPassword(e.target.value)}/>
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
