import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {formatDate} from "../../../components/secondary-functions";


function Products() {

    return (
        <AdminLayout>
            <RenderProducts />
        </AdminLayout>
    )
}


function RenderProducts(){
    const [products, setProduct] = useState([]);
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);

    const fetchLinks = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            await request(`${process.env.API_URL}/api/admin/products`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }, signal).then(result=>{

                setProduct(result.data);


            });

            return function cleanup(){
                abortController.abort();
            }
        }catch(e){
            console.log(e.message)
        }
    }, [request, token]);

    useEffect(()=>{
        if(!products.length){
            fetchLinks();
        }
    }, [fetchLinks]);


    const cutText = (text)=>{

        if(text&&text!==null){
            const arrT = text.split(" ");
            const num = 20;
            const resTxt = [];
            if(text.length>150){
                for(let i=0; i<num; i++){
                    resTxt.push(arrT[i]);
                }

                return resTxt.join(" ") + '...'
            }
        }


        return text;

    }




    const deleteProduct = async (id)=>{
        try{
            await request(`${process.env.API_URL}/api/admin/products/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                fetchLinks();
                setAlert('Продукт успешно удален!');

                setTimeout(()=>{setAlert(false)}, 3000)
            })
                .catch(err=>console.log(err));

        }catch(e){
            setError(e.message)
        }
    }



    if(loading){
        return(<p>Loading</p>)
    }

    if(!loading){
        if(!products.length){
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
        <h3 className="text-center">Список всех продуктов</h3>
        <table className="mt-5">
            <thead>
            <tr>
                <td className="font-weight-bold text-center">id</td>
                <td className="font-weight-bold text-center">Image</td>
                <td className="font-weight-bold text-center">Title</td>
                <td className="font-weight-bold text-center">Description</td>
                <td className="font-weight-bold text-center">Created At</td>
                <td className="font-weight-bold text-center">Publish</td>
                <td className="font-weight-bold text-center"></td>
            </tr>
            </thead>
            <tbody>
            {
                (products||[]).map(item=>{

                    const date_create = formatDate(item.createdAt);
                    let imageMain = item.Images.length?(item.Images.filter(item=>item.main).length?item.Images.filter(item=>item.main)[0].small:item.Images[0].small):process.env.DEFAULT_IMAGE;
                    return(
                        <tr key={item.id}>
                            <td className="text-center">{item.id}</td>
                            <td className="text-center">
                                <div style={{width:'110px', padding:'5px'}}><img src={imageMain} alt="" className="img-contain"/></div>
                            </td>
                            <td className="text-center"><p>{item.title}</p></td>
                            <td className="text-center"><p>{cutText(item.description)}</p></td>
                            <td className="text-center"><p>{date_create}</p></td>
                            <td className="text-center">
                                {
                                    item.publish?<p className="text-success mb-0">✔</p>:
                                        <p className="text-danger mb-0">❌</p>
                                }
                            </td>
                            <td className="text-center">
                                <div className="d-flex justify-content-around">
                                    <Link href={`./products/[id]`} as={`./products/${item.id}`}>
                                        <a>
                                            <div className="icon-tool">
                                                <img src="../static/icons/eye.svg" alt=""/>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href={`./products/edit/[id]`} as={`./products/edit/${item.id}`}>
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
        <div className="mt-3">
            <Link href={`./products/create`} as={`./products/create`} >
                <a>
                    <p className="text-success font-weight-bold">
                        + Create New Product
                    </p>
                </a>
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
                
                .close{ 
                    top: 5px;
                    right: 10px;
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



export default Products;