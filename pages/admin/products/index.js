import {useState, useEffect, useContext, useCallback} from 'react'
import Link from 'next/link'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {formatDate} from "../../../components/secondary-functions";
import {decrypt} from '../../../components/secondary-functions';
import {useAuth} from '../../../hooks/auth.hook';
import {PreloaderComp} from '../../../components/Preloader';
import Error from '../../../components/Error';

function Products({serverProducts, serverErr}) {

    const [products, setProducts] = useState([]);
    const [mount, setMount] = useState(true);
    const [error, setError] = useState(null);
    const {request, loading} = useHttp();
    const {token, logout} = useAuth();
    const [alert, setAlert] = useState(false);
 
    useEffect(()=>{
        if(mount){
            if(!serverProducts) fetchLinks();

            else{
                if(serverErr===null){
                    setProducts(serverProducts.data);

                }else{
                    setError(serverErr);
                }
            }

            setMount(false);
           
        }
    }, [serverProducts]);


    useEffect(()=>{
        if(serverErr!==null){
            if(serverErr===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }

            if(serverErr===401){
                logout();
            }
        }
    }, [serverErr])

    const fetchLinks = async ()=>{

        try{
          
            await request(`${process.env.API_URL}/api/admin/products`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>setProduct(result.data))
            .catch(err=>setError(err.message))
        }catch(e){
            console.log(e.message)
        }
    };

    const deleteProduct = async (id)=>{

        try{
            await request(`${process.env.API_URL}/api/admin/products/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                setProducts(products.filter(item=>item.id!==id));
                setAlert('Product removed successfully!');

                setTimeout(()=>{setAlert(false)}, 3000)
            })
                .catch(err=>setAlert(err.message));

        }catch(e){
            setError(e.message)
        }
    }

    if(loading){(<PreloaderComp />)}

    if(error){(<Error />)}

    if(!loading){
        if(!products.length){
            return(<AdminLayout>
                <p className="text-center mt-5">This list is empty</p>
                <Link href={`./products/create`} as={`./products/create`} >
                    <a>
                        <p className="text-success font-weight-bold">
                            + Create New Product
                        </p>
                    </a>
                </Link>
            </AdminLayout>)
        }
    }

    return (
        <AdminLayout>
            <RenderProducts products={products} alert={alert} onRemove={deleteProduct}/>
        </AdminLayout>
    )
}


function RenderProducts({products, alert, onRemove}){
   
    

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


    return( <div className="wrap-main container">
        <div className={`alert alert-success position-fixed ${alert?'show':'fade'}`} role="alert" >
            {alert}
        </div>
      
        <h3 className="text-center">List of all products</h3>

         <div className="mt-3">
            <Link href={`./products/create`} as={`./products/create`} >
                <a>
                    <p className="text-success font-weight-bold">
                        + Create New Product
                    </p>
                </a>
            </Link>
        </div>

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
                products.map(item=>{

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
                                    <div className="icon-tool" onClick={onRemove.bind(null, item.id)}>
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


export async function getServerSideProps(ctx){

    if(ctx.req.headers.cookie){
        let cookie = ctx.req.headers.cookie.split(';').filter(item=>item.indexOf('users')>0);
        let ind = cookie.length && cookie[0].indexOf('=')>0?cookie[0].indexOf('='):null;

        if(cookie.length && ind!==null){

            let users = decrypt(cookie[0].slice(ind+1));

            const response = await fetch(`${process.env.API_URL}/api/admin/products`, {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${users.token}`
                }
            })

      

            if(!response.ok){
                return{
                    props:{serverProducts:null, serverErr:response.status}
                }
            }

            const serverProducts = await response.json();
                    

            return {
                props:{serverProducts, serverErr:null}
            }
        }

    }
    return {
        props:{serverProducts:null, serverErr:'Something went wrong'}
    }


}



export default Products;
