import {useState, useEffect, useContext, useCallback} from 'react'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {useRouter} from "next/router";
import {decrypt, formatDate} from '../../../components/secondary-functions';
import Preloader from '../../../components/Preloader';



export default function ViewUser({userServer, storeServer, errorServer}) {

    const [user,setUser] = useState(null);
    const [store, setStore]
console.log(userServer)
    return (
        <AdminLayout>
            <ViewComponent user="" store="" errors=""/>
        </AdminLayout>
    )
}


function ViewComponent({userServer, storeServer, errorServer}){

    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [mountUser, setMountUser] = useState(true);
    const [mountStore, setMountStore] = useState(true);
    const {request, loading} = useHttp();
    const {token, userId, logout} = useContext(AuthContext);
    const {query} = useRouter();
    const [error, setError] = useState(null);

    const fetchLinks = async ()=>{

        try{
           await request(`${process.env.API_URL}/api/products/cart/${userId}/true`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
               setStore(result.data);

           }).catch(err=>{
               setError(err.message)
           });

        }catch(e){console.log(e)}

    };


    const storeUser = async ()=>{

        try{
            await request(`${process.env.API_URL}/api/users/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
                setUser(result.data);

            }).catch(err=>{
                setError(err.message)
            });

        }catch(e){console.log(e)}

    };



    useEffect(()=>{
        if(mountUser){

            if(!userServer){
                fetchLinks()
            }else{
                if(errorServer===401) logout();
                setError(errorServer);
            }

            setMountUser(false);
        }
    }, [mountUser]);

    useEffect(()=>{
        if(mountStore){
            if(!storeServer){
                storeUser()
            }else{
                if(errorServer===401) logout();
                setError(errorServer);
            }

            setMountStore(false);
        }
    }, [mountStore]);

    useEffect(()=>{
        if(errorServer!==null){
            if(errorServer===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }
        }
    }, [errorServer])

    let date_create = '';
    if(user!==null && user){
        date_create = formatDate(user.created_at);
    }

    if(loading){return(<Preloader />)}

    let address = null;
    if(user && user.Address){
        address = `${user.Address.country}, ${user.Address.city}, ${user.Address.street}, ${user.Address.province}, ${user.Address.postal_code}`
    }

    if(error){
        return(<p>error</p>)
    }

   //console.log(user)

    return(
        <div className="wrap-main container">

            {
                user!==null&&user?(
                    <>
                    <h3 className="text-info">{user.email}</h3>
                     <div className="content-info mt-5">
                         <p><span className="font-weight-bold">Created:</span> {date_create}</p>
                         <p><span className="font-weight-bold">Name:</span> {user.name}</p>
                         <p><span className="font-weight-bold">Last Name:</span> {user.last_name}</p>
                         <p><span className="font-weight-bold">Address:</span> {address && address!==null?address:''}</p>
                     </div>
                        <div className="user-store">

                        </div>
                    </>
                ):(<h2 className="text-center">User is not found!</h2>)
            }

        <style jsx>{
            `
                table{
                    width:100%;
                }
                
                table td{
                    border: 1px solid #17a2b8;
                }
                
                .icon-tool{
                    width:18px;
                    height:18px;
                    opacity:.7;
                    transition:all .5s ease;
                }
                
                .icon-tool:hover{
                    cursor:pointer;
                    opacity:1;
                }
                .icon-tool img{
                    vertical-align:top;
                }
                
                .wrap-main .show-alert{
                    animation-name:ShowAlert;
                    animation-duration: 1s;
                    animation-fill-mode:forwards;
                }
                
                @keyframes ShowAlert{
                    0%{
                      
                        transform: translateY(-1000px);
                    }
                    
                    100%{
                      
                        transform: translateY(0px);
                    }
                }
                
                .wrap-main .hide-alert{
                    transition: opacity .6s ease;
                    opacity:0;
                }
                
                
                
            `
        }</style>
    </div>);
}

export async function getServerSideProps(ctx){

    if(ctx.req.headers.cookie){
        let cookie = ctx.req.headers.cookie.split(';').filter(item=>item.indexOf('users')>0);
        let ind = cookie.length && cookie[0].indexOf('=')>0?cookie[0].indexOf('='):null;

        if(cookie.length && ind!==null){
            let users = decrypt(cookie[0].slice(ind+1));

            const response = await fetch(`${process.env.API_URL}/api/users/${ctx.query.id}`, {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${users.token}`
                }
            })

            const store = await fetch(`${process.env.API_URL}/api/products/cart/${users.userId}/true`, {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${users.token}`
                }
            })


            if(!response.ok || !store.ok){
                return{
                    props:{userServer:null, storeServer:null, serverErr:!response.ok?response.status:store.status}
                }
            }

            const userServer = await response.json();
            const storeServer = await store.json();
            console.log(storeServer)

            return {
                props:{userServer, storeServer, serverErr:null}
            }
        }

    }
    return {
        props:{userServer:null, storeServer:null, serverErr:'Something went wrong'}
    }


}
