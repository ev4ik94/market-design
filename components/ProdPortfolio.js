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
            console.log('setLoading')
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

                                        <a data-fancybox="gallery" href={item && item.Images.length?item.Images[0].large:process.env.DEFAULT_IMAGE}>
                                            <img src={item && item.Images.length?item.Images[0].small:process.env.DEFAULT_IMAGE} className="img-cover"/>
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



