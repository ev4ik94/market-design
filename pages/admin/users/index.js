import Head from 'next/head'
import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {formatDate, getCookie} from "../../../components/secondary-functions";


function Users() {

    return (
        <AdminLayout>
           <RenderContent />
        </AdminLayout>
    )
}


function RenderContent(){
    const [users, setUsers] = useState([]);
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);

    const fetchLinks = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            await request(`${process.env.API_URL}/api/users`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }, signal).then(result=>{

                setUsers(result.data);


            });

            return function cleanup(){
                abortController.abort();
            }
        }catch(e){
            setError(e.message)
        }
    }, [request, token]);

    useEffect(()=>{
       if(!users.length){
           fetchLinks();
       }
    }, [fetchLinks]);



    const deleteUser = async (id)=>{
        try{
           await request(`${process.env.API_URL}/api/users/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                fetchLinks()
               setAlert('Пользователь успешно удален!')
               setTimeout(()=>{setAlert(false)}, 3000)
           })
               .catch(err=>setError(err.message));

        }catch(e){
            console.log(e)
        }
    }



    if(loading){
        return(<p>Loading</p>)
    }

    if(!loading){
        if(!users.length){
            return(<p className="text-center mt-5">Список Пуст</p>)
        }
    }

    return( <div className="wrap-main container">
        <div className={`alert alert-success position-fixed ${alert?'show':'fade'}`} role="alert" >
            {alert}
        </div>
        <div className={`alert alert-danger position-fixed ${error?'show':'fade'}`} role="alert">
            <strong className="text-center">Error!</strong>
            <br />
            {error}
            <button type="button" className="close position-absolute" onClick={()=>setError(false)}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <h3 className="text-center">Список Зарегистрированных пользователей</h3>
        <table className="mt-5">
            <thead>
                <tr>
                    <td className="font-weight-bold text-center">id</td>
                    <td className="font-weight-bold text-center">Email</td>
                    <td className="font-weight-bold text-center">Name</td>
                    <td className="font-weight-bold text-center">Last Name</td>
                    <td className="font-weight-bold text-center">Created At</td>
                    <td className="font-weight-bold text-center"></td>
                </tr>
            </thead>
            <tbody>
            {
                (users||[]).map(item=>{

                    const date_create = formatDate(item.created_at);

                    return(
                        <tr key={item.id}>
                            <td className="text-center">{item.id}</td>
                            <td className="text-center">{item.email}</td>
                            <td className="text-center">{item.name}</td>
                            <td className="text-center">{item.last_name}</td>
                            <td className="text-center">{date_create}</td>
                            <td className="text-center">
                                <div className="d-flex justify-content-around">
                                    <Link href={`./users/[id]`} as={`./users/${item.id}`}>
                                        <a>
                                            <div className="icon-tool">
                                                <img src="../static/icons/eye.svg" alt=""/>
                                            </div>
                                        </a>
                                    </Link>
                                    <div className="icon-tool" onClick={()=>deleteUser(item.id)}>
                                        <img src="../static/icons/delete.svg" alt=""/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
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
                
                 .alert{
                    left: 45%;
                   
                    width:30%;
                    z-index: 5;
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



export default Users;