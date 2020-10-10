import Head from 'next/head';
import {useState, useEffect, useContext} from 'react';
import NavSide from './elements/sideNav';
import {AuthContext} from "../../context/auth.context";
import {useAuth} from "../../hooks/auth.hook";
import Header from "../../components/admin/elements/header";



export default function AdminLayout({children}) {

    const {token, userId, login, logout, ready} = useAuth();
    const isAuthentication = !!token;

    const addPropsToChildren = (children, props) =>
        React.Children.map(children, el =>
            React.cloneElement(el, props)
        )

    if(!ready){
        return <p>Loading ...</p>
    }
    return (

            <React.Fragment>

            <Head>
                <title>Admin DashBoard</title>
            </Head>


                <AuthContext.Provider value={{
                    token, userId, login, logout, isAuthentication
                }}>
                    {
                        isAuthentication?(
                            <div className="main-board">
                                <NavSide />
                                <main>
                                    <Header />
                                    <div className="wrap-content col-9 float-right">
                                        {children}
                                    </div>
                        </main></div>):(<Authenticate />)
                    }
                </AuthContext.Provider>
        </React.Fragment>

    )
}


function Authenticate(){

    const auth = useContext(AuthContext);

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');


    const signIn = async (e)=>{
        e.preventDefault();
        const body = JSON.stringify({
            email,
            password
        });

        await fetch(`${process.env.API_URL}/api/admin/login`, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body
        })
            .then(response=>{

                if(!response.ok){
                    throw new Error(response.message || 'Something went wrong');
                }
               return response.json()

            })
            .then(result=>{
                auth.login(result.data.token, result.data.userId, result.data.login);
            })
            .catch(e=>console.log({message: e.message}))
    }

    return(
        <div className="wrap-main-form-admin">
            <div className="container position-relative">
                <div className="wrap-form">
                    <form className="col-6 mx-auto">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email"
                                   className="form-control"
                                   id="exampleInputEmail1"
                                   value={email}
                                   onChange={(e)=>setEmail(e.target.value)}
                            />

                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password"
                                   className="form-control"
                                   id="exampleInputPassword1"
                                   value={password}
                                   onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" onClick={signIn}>Войти</button>
                    </form>
                </div>



            </div>
            <style jsx>{`
                .wrap-main-form-admin{
                        height:99vh;
                        background: url('/images/back-form.jpg');
                    }
                 
                 .wrap-form{
                    margin-top: 20vh;
                    padding-bottom: 30px;
                    padding-top: 30px;
                    background: rgba(3, 32, 78, .6);
                    box-shadow: 2px 2px 3px #0000004f;
                 }
                 
                 .wrap-form  label{
                    color:white;
                 }
                 
                           
            `}</style>
        </div>

    )
}




