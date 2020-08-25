
import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {useRouter} from "next/router";
import {formatDate} from '../../../components/secondary-functions';



export default function ViewUser() {

    return (
        <AdminLayout>
            <ViewComponent />
        </AdminLayout>
    )
}


function ViewComponent(){

    const [user, setUser] = useState(null);
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const {query} = useRouter();

    const fetchLinks = useCallback(async ()=>{

        try{
           await request(`${process.env.API_URL}/api/users/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
                console.log(result)
               setUser(result.data);
           }).catch(err=>{
               console.log(err.message)
           });


        }catch(e){
            console.log(e)
        }
    }, [request, token]);

    useEffect(()=>{
        if(user===null){
            fetchLinks();
        }
    }, [fetchLinks]);

    let date_create = '';
    if(user!==null && user){
        date_create = formatDate(user.created_at);
    }

    return(
        <div className="wrap-main container">

            {
                user!==null&&user?(
                    <>
                    <h3 className="text-info">{user.email}</h3>
                     <div className="content-info mt-5">
                         <p><span className="font-weight-bold">Создан:</span> {date_create}</p>
                         <p><span className="font-weight-bold">Имя:</span> {user.name}</p>
                         <p><span className="font-weight-bold">Фамилия:</span> {user.last_name}</p>
                         <p><span className="font-weight-bold">Адрес:</span> {user.Address.address}</p>
                     </div>
                    </>
                ):(<p></p>)
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