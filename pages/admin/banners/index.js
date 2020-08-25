import Head from 'next/head'
import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {formatDate} from "../../../components/secondary-functions";

export default function Banners() {

    return (
        <AdminLayout>

            <RenderBanners />

        </AdminLayout>
    )
}

function RenderBanners(){

    const [banners, setDanners] = useState([]);
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const [deleteUs, setDel] = useState(false);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);

    const fetchLinks = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            await request(`${process.env.API_URL}/api/admin/banners`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }, signal).then(result=>{

                setDanners(result.data);


            });

            return function cleanup(){
                abortController.abort();
            }
        }catch(e){
            console.log(e.message)
        }
    }, [request, token]);

    useEffect(()=>{
        if(!banners.length){
            fetchLinks();
        }
    }, [fetchLinks]);






    const deleteProduct = async (id)=>{
        try{
            await request(`${process.env.API_URL}/api/admin/banners/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                fetchLinks();
                setAlert('Баннер успешно удален!');

                setTimeout(()=>{setAlert(false)}, 3000)
            })
                .catch(err=>console.log(err));

        }catch(e){
            console.log(e)
        }
    }



    if(loading){
        return(<p>Loading</p>)
    }

    if(!loading){
        if(!banners.length){
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
        <h3 className="text-center">Список всех Баннеров</h3>
        <table className="mt-5">
            <thead>
            <tr>
                <td className="font-weight-bold text-center">id</td>
                <td className="font-weight-bold text-center">Image</td>
                <td className="font-weight-bold text-center">Path</td>
                <td className="font-weight-bold text-center">Publish</td>

                <td className="font-weight-bold text-center"></td>
            </tr>
            </thead>
            <tbody>
            {
                (banners||[]).map(item=>{


                    return(
                        <tr key={item.id}>
                            <td className="text-center">{item.id}</td>
                            <td className="text-center">
                               <div className="container-img mx-auto" style={{height:'100px', width:'100px'}}>
                                   <img src={item.ImageBanner.small} alt="" className="img-contain"/>
                               </div>
                            </td>
                            <td className="text-center"><p>{item.button_url}</p></td>
                            <td className="text-center">
                                {
                                    item.publish?<p className="text-success mb-0">✔</p>:
                                        <p className="text-danger mb-0">❌</p>
                                }
                            </td>

                            <td className="text-center">
                                <div className="d-flex justify-content-around">
                                    <Link href={`./banners/[id]`} as={`./banners/${item.id}`}>
                                        <a>
                                            <div className="icon-tool">
                                                <img src="../static/icons/eye.svg" alt=""/>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href={`./banners/edit/[id]`} as={`./banners/edit/${item.id}`}>
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

        <div className="create-ban-link mt-3">
            <Link href={`./banners/create`}>
                <a className="text-success font-weight-bold">+ Create new Banner</a>
            </Link>
        </div>

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
                    width:30%;
                    left:45%;
                    z-index:5;
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
