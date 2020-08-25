import Head from 'next/head'
import {useState, useEffect, useContext} from 'react'
import Link from 'next/link'
import {AuthContext} from "../../../context/auth.context";
import {useAuth} from "../../../hooks/auth.hook";


export default function Header() {

    const auth = useContext(AuthContext);
    const {token, userId} = auth;


    const signOut = (e)=>{

        e.preventDefault();
        auth.logout(token, userId)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <button type="button" className="btn btn-danger" onClick={signOut}>Log Out</button>
                    </ul>
                </div>
            </nav>

            <style jsx>{`
                .navbar{
                    border-bottom: 1px solid #b9b9b9;
                    padding:5px;
                
                }
               
                
              
            `}</style>

        </>
    )
}
