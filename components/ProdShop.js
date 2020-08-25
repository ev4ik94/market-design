import {useState, useEffect} from 'react'
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import {useRouter} from "next/router";

export default function ProductShop({products}){
    const router = useRouter();

    if(products!==null&&!products.length){
        return(<div style={{minHeight:'500px'}}>
            <h3 className="text-center">The list is empty!</h3>
        </div>
        )
    }

    return(
            <div style={{minHeight:'500px'}}>

                <ul className="pl-0 d-flex shop-products flex-wrap">
                    {
                        (products||[]).map(item=>{
                            let mainImagesm = item.Images.length?
                                (item.Images.filter(item=>item.main).length?item.Images.filter(item=>item.main)[0].small:item.Images[0].small)
                                :process.env.DEFAULT_IMAGE;

                            let mainImagelg = item.Images.length?
                                (item.Images.filter(item=>item.main).length?item.Images.filter(item=>item.main)[0].large:item.Images[0].large)
                                :process.env.DEFAULT_IMAGE;
                            return(
                                <li key={item.id} className="item-product col-lg-4 col-md-6 col-sm-6">
                                    <Link href="/shop-products/[id]" as={`/shop-products/${item.id}`}>
                                        <a>
                                            <div className="img-container mb-4">
                                                <picture>
                                                    <source srcSet={mainImagesm} media="(max-width: 600px)" />
                                                    <img src={mainImagelg} alt="MDN" className="img-cover"/>
                                                </picture>
                                            </div>
                                        </a>
                                    </Link>
                                    <div className="descript-product d-flex justify-content-between">
                                        <Link href="/shop-products/[id]" as={`/shop-products/${item.id}`}>
                                            <a title={item.title}>
                                                {item.title}
                                            </a>
                                        </Link>
                                        <p className="font-weight-bold mb-0 col-5 text-right">
                                            <span>{item.costs.map(cost=>(cost.type==='Personal'?cost.cost:''))}</span>&nbsp;
                                            USD
                                        </p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>

                <style jsx>
                    {
                        `
                        .item-product{
                            padding:10px;
                        }
                        
                        .item-product .img-container{
                            height:200px;
                            max-height:200px;
                        }
                        
                        .descript-product a{
                            font-size:1.2rem;
                            color:#263238;
                            text-decoration:none;
                        }
                        
                        .descript-product a:before{
                            content:attr(title);
                            font-weight:bold;
                            height:0;
                            overflow:hidden;
                            visibility:hidden;
                            display: block;
                        }
                        
                        .descript-product a:hover{
                            font-weight:bold;
                        }
                        
                        .descript-product p{
                            font-size:1.2rem;
                        }
                        
                        .descript-product span{
                            font-size:1.5rem;
                        }
                        
                        .item-product a:first-child:hover img{
                            opacity:.6;
                            transition:all .6s ease;
                        }
                        
                        
                    
                    `
                    }
                </style>
            </div>
        )



}

