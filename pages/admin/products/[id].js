import {useState, useEffect, useContext, useRef} from 'react'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {useRouter} from "next/router";
import {formatDate} from '../../../components/secondary-functions';



export default function ViewProduct() {

    return (
        <AdminLayout>
            <ViewComponent />
        </AdminLayout>
    )
}


function ViewComponent(){

    const [product, setProduct] = useState(null);
    const {request} = useHttp();
    const {token} = useContext(AuthContext);
    const {query} = useRouter();
    const [imageMain, setImage] = useState(process.env.DEFAULT_IMAGE);
    const [show, setShow] = useState(false);

    const descript = useRef(null);

    const fetchLinks = async ()=>{

        try{
            await request(`${process.env.API_URL}/api/admin/products/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
                setProduct(result.data);
            }).catch(err=>{
                console.log(err.message)
            });


        }catch(e){
            console.log(e)
        }
    };

    const collapseBlock = (show)=>{
        let cont = descript.current.parentElement;
        let height = descript.current.offsetHeight;
        setShow(show);
        if(show){
            cont.style = `height:${height}px`;
        }else{
            cont.style = ``;
        }
        



    }

    useEffect(()=>{
        if(product===null){
            fetchLinks();
        }
    }, [fetchLinks]);

    useEffect(()=>{

        if(product!==null&&product.Images.length){
            setImage(product.Images[0].large!==null?product.Images[0].large:process.env.DEFAULT_IMAGE)
        }

    }, [product]);



    return(
        <div className="wrap-main container">

            {
                product!==null&&product?(
                    <>

                        <div className="content-info mt-5 d-flex justify-content-between">
                            <div className="content-images col-6">
                                <div className="main-view-img">
                                    <img src={imageMain} alt="image product" className="img-cover"/>
                                </div>
                                <ul className="d-flex pl-0 mt-2">
                                    {
                                        product.Images.length>1?(product.Images || []).map(item=>{

                                            return(
                                                <li key={item.id} className="preview-img">
                                                    <div className="img-sml-view" onClick={(e)=>setImage(item.large)}>
                                                        <img src={item.small} alt="preview image" className="img-cover"/>
                                                    </div>
                                                </li>
                                            )
                                        }):(<li></li>)
                                    }
                                </ul>
                            </div>
                            <div className="content-info col-6">
                                <h3 className="text-info">{product.title}</h3>
                                <div className="content-main-inf pl-2">
                                    <ul className="pl-0">
                                        <li>
                                            <p className="font-weight-bold mb-0">Categories</p>
                                            <p className="mb-0">{product.categories?product.categories.title:''}</p>
                                        </li>
                                        <li>
                                            <p className="font-weight-bold mb-0">Description</p>
                                            <div className="content-description hidden">
                                                <p className="mb-0" ref={descript}>{product.description}</p>
                                            </div>
                                            <button onClick={()=>collapseBlock(!show)}>{show?'hide':'read more'}</button>
                                        </li>
                                        <li>
                                            <p className="font-weight-bold mb-0">Cost</p>
                                            <ul className="pl-0">
                                                {
                                                    (product.costs ||[]).map(item=>(
                                                        <li key={item.id}>
                                                            <div className="mb-0 d-flex">
                                                               <p className="mb-0 mr-3">
                                                                   <span className="text-secondary">{item.type} </span>
                                                                   {item.cost}$
                                                               </p>
                                                               <p className="mb-0 mr-3">
                                                                   <span className="text-secondary  mr-3">Discount</span>
                                                                   {item.discount>0?
                                                                       (<span className="text-success font-weight-bold">{item.discount}%</span>)
                                                                       :(<span className="text-danger font-weight-bold">false</span>)}
                                                               </p>
                                                            </div>

                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </li>

                                        <li>
                                            <p className="font-weight-bold mb-0">Tags</p>
                                            <ul className="pl-0 d-flex flex-wrap">
                                                {
                                                    (product.tags ||[]).map(item=>(
                                                        <li key={item.id} className="item-tag">
                                                            <p className="mb-0">
                                                                #{item.title}
                                                            </p>

                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </li>

                                        <li>
                                            <p className="font-weight-bold mb-0">Publish {product.publish?<span className="text-success mb-0">✔</span>:
                                                <span className="text-danger mb-0">❌</span>}</p>
                                        </li>
                                    </ul>


                                </div>
                            </div>
                        </div>
                        <div className="block-reviews mt-3">
                            <h2>Reviews</h2>
                            <ul className="pl-0 mt-3">
                                {
                                    (product.review||[]).map(item=>(
                                        <li key={item.id}>
                                            <p className="text-primary font-weight-bold mb-0">{item.email}</p>
                                            <p className="mb-0">{item.name}</p>
                                            <p className="mb-0">{item.text}</p>
                                            <p className="text-secondary mb-0">{formatDate(item.createdAt)}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </>
                ):(<p></p>)
            }

            <style jsx>{
                `
               .main-view-img{
                    width: 100%;
                    height: 300px;
               }
               
               .preview-img{
                    width: 70px;
                    height: 70px;
                     margin-right:10px;
               }
               
               .img-sml-view{
                    width: 100%;
                    height: 100%;
                    padding: 3px;
                    border: 1px solid #a4a6a9;
                    border-radius: 3px;
                    overflow:hidden;
                    
               }
               
               .content-main-inf > ul >li{
                    padding: 5px 5px 5px 0px;
               }
               
               .block-reviews > ul>li{
                    padding: 5px 10px;
                    background: #caf8ff;
                    border-radius: 5px;
               }
               
               .item-tag{
                    padding: 3px;
                    margin: 3px;
                    background: #c7f2f9;
                    border-radius: 5px;
               }

               .content-description{
                   transition:all .4s ease;
               }

               .content-description > p{line-height: 1.6;}

               .content-description.hidden{

                   height:200px;
                   overflow:hidden;
               }
               
      
                
            `
            }</style>
        </div>);
}
