import {useState, useEffect} from 'react'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {useAuth} from '../../../hooks/auth.hook';
import {decrypt, formatDate} from '../../../components/secondary-functions';
import {PreloaderComp} from '../../../components/Preloader';
import Error from '../../../components/Error';


export default function ViewUser({userServer, storeServer, errorServer = null}) {

    const [user,setUser] = useState(null);
    const [store, setStore] = useState([]);
    const [error, setError] = useState(null);
    const [mountUser, setMountUser] = useState(true);
    const [mountStore, setMountStore] = useState(true);
    const {request, loading} = useHttp();
    const {logout, token, userId} = useAuth()
   
    useEffect(()=>{
        if(mountUser){
            if(!userServer) getUser();

            else{
                if(errorServer===null){
                    setUser(userServer);
                }else{
                    setError(errorServer)
                }
            }
            setMountUser(false);
        }
        
    }, [userServer]);

    useEffect(()=>{
        
        if(mountStore){
            if(!storeServer) fetchLinks();

            else{
                if(errorServer===null){
                    setStore(storeServer.data);
                }else{
                    setError(errorServer)
                }
            }

            setMountStore(false);
        }
    }, [storeServer]);



    useEffect(()=>{
        if(errorServer!==null){
            if(errorServer===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }

            if(errorServer===401){
                logout();
            }
        }
    }, [errorServer])

    const fetchLinks = async ()=>{

        try{
           await request(`${process.env.API_URL}/api/products/cart/${userId}/true`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
               setStore(result.data);

           }).catch(()=>{
               setError(500)
           });

        }catch(e){console.log(e)}

    };


    const getUser = async ()=>{

        try{
            await request(`${process.env.API_URL}/api/users/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
                setUser(result.data);

            }).catch(()=>{
                setError(500)
            });

        }catch(e){console.log(e)}

    };

    if(loading){return(<PreloaderComp />)}

    if(error){return(<Error />)}

    
    return (
        <AdminLayout>
            <ViewComponent user={user} store={store} error={error}/>
        </AdminLayout>
    )
}


function ViewComponent({user, store}){


    let date_create = '';
    if(user!==null && user.data){
        date_create = formatDate(user.data.created_at);
    }

   
    let address = null;
    if(user.data && user.data.Address){
        address = `${user.data.Address.country}, ${user.data.Address.city}, ${user.data.Address.street}, ${user.data.Address.province}, ${user.data.Address.postal_code}`
    }

   
  
    return(
        <div className="wrap-main container">

        <h2 className="text-center">User Information</h2>

            {
                user!==null && user.data?(
                    <>
                    <h3 className="text-info">{user.data.email}</h3>
                     <div className="content-info mt-3">
                         <p><span className="font-weight-bold">Created:</span> {date_create}</p>
                         <p><span className="font-weight-bold">Name:</span> {user.data.name}</p>
                         <p><span className="font-weight-bold">Last Name:</span> {user.data.last_name}</p>
                         <p><span className="font-weight-bold">Address:</span> {address && address!==null?address:''}</p>
                     </div>
                      
                    </>
                ):(<h2 className="text-center">User is not found!</h2>)
            }

            <h2 className="text-center mt-5">Purchase History</h2>

            {
                store!==null && store.length?(<ul>
                    {
                        (store||[]).map(item=>(
                            <li>{item.title}</li>
                        ))
                    }
                </ul>):(<p className="text-center">This list is Empty</p>)
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
          

            return {
                props:{userServer, storeServer, serverErr:null}
            }
        }

    }
    return {
        props:{userServer:null, storeServer:null, serverErr:'Something went wrong'}
    }


}
