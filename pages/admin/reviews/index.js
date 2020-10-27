import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {formatDate} from "../../../components/secondary-functions";
import {PreloaderComp} from '../../../components/Preloader';

export default function Reviews() {

    return (
        <AdminLayout>
           <RenderReviews />
        </AdminLayout>
    )
}

function RenderReviews(){

        const [reviews, setReviews] = useState([]);
        const {request, loading} = useHttp();
        const {token} = useContext(AuthContext);
        const [error, setError] = useState(false);
        const [alert, setAlert] = useState(false);

        const fetchLinks = useCallback(async ()=>{

            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                await request(`${process.env.API_URL}/api/admin/review`, 'GET', null, {
                    Authorization: `Bearer ${token}`
                }, signal).then(result=>{

                    setReviews(result.data);

                });

                return function cleanup(){
                    abortController.abort();
                }
            }catch(e){
                setError(e.message)
            }
        }, [request, token]);

        useEffect(()=>{
            if(!reviews.length){
                fetchLinks();
            }
        }, [fetchLinks]);


        const cutText = (text)=>{

            const arrT = text.split(" ");
            const num = 20;
            const resTxt = [];
            if(text.length>150){
                for(let i=0; i<num; i++){
                    resTxt.push(arrT[i]);
                }

                return resTxt.join(" ") + '...'
            }

            return text;

        }




        const deleteProduct = async (id)=>{
            try{
                await request(`${process.env.API_URL}/api/admin/review/${id}`, 'DELETE', null, {
                    Authorization: `Bearer ${token}`
                }).then(()=>{
                    fetchLinks();
                    setAlert('Пользователь успешно удален!')
                    setTimeout(()=>{setAlert(false)}, 3000)
                })
                    .catch(err=>setError(err.message));

            }catch(e){
                setError(e.message)
            }
        }



        if(loading){
            return(<PreloaderComp />)
        }

        if(!loading){
            if(!reviews.length){
                return(<p className="text-center mt-5">This list is empty</p>)
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
            <h3 className="text-center">List of reviews</h3>
            <table className="mt-5">
                <thead>
                <tr>
                    <td className="font-weight-bold text-center">id</td>
                    <td className="font-weight-bold text-center">Name</td>
                    <td className="font-weight-bold text-center">Email</td>
                    <td className="font-weight-bold text-center">Text</td>
                    <td className="font-weight-bold text-center">Created At</td>
                    <td className="font-weight-bold text-center"></td>
                </tr>
                </thead>
                <tbody>
                {
                    (reviews||[]).map(item=>{

                        const date_create = formatDate(item.createdAt);

                        return(
                            <tr key={item.id}>
                                <td className="text-center">{item.id}</td>
                                <td className="text-center"><p>{item.name}</p></td>
                                <td className="text-center"><p>{item.email}</p></td>
                                <td className="text-center"><p>{cutText(item.text)}</p></td>
                                <td className="text-center"><p>{date_create}</p></td>

                                <td className="text-center">
                                    <div className="d-flex justify-content-around">
                                        <Link href={`./reviews/[id]`} as={`./reviews/${item.id}`}>
                                            <a>
                                                <div className="icon-tool">
                                                    <img src="../static/icons/eye.svg" alt=""/>
                                                </div>
                                            </a>
                                        </Link>
                                        <Link href={`./reviews/edit/[id]`} as={`./reviews/edit/${item.id}`}>
                                            <a>
                                                <div className="icon-tool">
                                                    <img src="../static/icons/pencil.svg" alt=""/>
                                                </div>
                                            </a>
                                        </Link>
                                        <div className="icon-tool" onClick={()=>deleteProduct(item.id)}>
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
                
                table td p{
                    padding:10px 5px;
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
