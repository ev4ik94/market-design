import {useContext} from 'react'
import {AuthContext} from "../../../context/auth.context";



export default function Header() {

    const auth = useContext(AuthContext);
    const {token, userId} = auth;


    const signOut = (e)=>{

        e.preventDefault();
        auth.logout(token, userId)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <button type="button" className="btn btn-outline-danger" onClick={signOut}>Log Out</button>
                    </ul>
                </div>
            </nav>

            <style jsx>{`
                .navbar{
                    border-bottom: 1px solid #b9b9b9;
                    padding:10px 5px;
                    background-color:#fff;
                
                }
               
                
              
            `}</style>

        </>
    )
}
