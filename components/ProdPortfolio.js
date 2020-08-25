import Head from 'next/head'
import {useState, useEffect} from 'react'
import Link from "next/link";
import Masonry from 'react-masonry-css'


export default function ProductPortfolio({products}){
    const [loading, setLoading] = useState(true);

    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    useEffect(()=>{
        if(products!==null&&products.length){
            setLoading(false);
        }
    },[products]);

    if(products!==null&&!products.length){
        return(<div style={{minHeight:'500px'}}>
                <h3 className="text-center">The list is empty!</h3>
            </div>
        )
    }


        return(
            <div style={{minHeight:'400px'}} className="mb-5">



                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                            {
                            (products||[]).map((item,index)=>{

                                return(
                                    <div key={item.id} className={`${loading?'w-0':'w-100'} item-product`}>

                                        <a data-fancybox="gallery" href={item.Images[0].large}>
                                            <img src={item.Images[0].small} className="img-cover"/>
                                        </a>

                                    </div>
                                )
                            })
                    }
                        </Masonry>



                <style jsx>
                    {
                        `
                    
                      .item-product a:hover{
                        opacity:.6;
                        transition:all .4s ease;
                      }
                        
                     
                    `
                    }
                </style>
            </div>
        )


}

/*
.portfolio-shop-products{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 10px;
    grid-auto-rows: minmax(100px, auto);
    grid-auto-flow: dense;
    padding: 10px;
}



.item-product:nth-child(odd){
    grid-column-end: span 3;
    grid-row-end: span 1;
}

.item-product:nth-child(even){
    grid-column-end: span 2;
    grid-row-end: span 1;
}

.item-product:nth-child(1){
    grid-column-end: span 4;
    grid-row-end: span 1;
}
.item-product:nth-child(2){
    grid-column-end: span 2;
    grid-row-end: span 1;
}
.item-product:nth-child(3){
    grid-column-end: span 2;
    grid-row-end: span 1;
}
    */


