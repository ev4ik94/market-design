import Head from 'next/head'
import {useState, useEffect} from 'react'
import MainLayout from '../components/MainLayout';
import Banner from "../components/Banner";
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import ProdShop from "../components/ProdShop";
import ProductPortfolio from "../components/ProdPortfolio";


export default function Home() {

    const [productsShop, setProductsShop] = useState(null);
    const [productsPortfolio, setProductsPortfolio] = useState(null);
    const {request, loading} = useHttp();


    useEffect(()=>{
        if(productsShop===null){
            getProducts(1,6)
        }
    }, [productsShop]);

    useEffect(()=>{
        if(productsShop===null){
            getProducts(3,18)
        }
    }, [productsPortfolio]);

    const getProducts = async(catId, limit)=>{
        await request(`${process.env.API_URL}/api/products?page=1&limit=${limit}&parentid=${catId}`)
            .then(result=>{
                if(catId===1){
                    setProductsShop(result.data.rows)
                }else{
                    setProductsPortfolio(result.data.rows)
                }

            })
            .catch(err=>{
                console.log(err)
            })
    }




  return (
      <MainLayout title={'Title'}>
        <Banner />
        <div className="container">
            <div className="top-description-site col-9 mx-auto">
                <p className="text-left">
                    <span className="font-weight-bold">DGIM STUDIO</span> - is the graphic design studio, specialized on vector graphics.
                    Every day we improve our skills so that you get the result you need in time.
                </p>
            </div>
            <div className="block-shop-list">
                <p className="font-weight-bold text-center text-uppercase pb-3" style={{fontSize:'1.5rem'}}>design for sale</p>
                <ProdShop products={productsShop}/>
                <Link href="/shop">
                    <a className="text-uppercase btn-more d-block text-center mx-auto">
                        see more
                    </a>
                </Link>
            </div>
            <div className="block-portfolio-list">
                <p className="font-weight-bold text-center text-uppercase pb-3 mt-5" style={{fontSize:'1.5rem'}}>custom designs</p>
                <ProductPortfolio products={productsPortfolio} />
                <Link href="/portfolio">
                    <a className="text-uppercase btn-more d-block text-center mx-auto">
                        see more
                    </a>
                </Link>
            </div>

        </div>
          <style jsx>
              {
                  `
                    .top-description-site{
                        padding:20px;
                       
                    }
                    
                    .top-description-site p{
                        font-size:1.2rem;
                    }
                    
                    .btn-more{
                            padding:15px 20px;
                            color:#000;
                            border:1px solid #000;
                            width:130px;
                            text-decoration:none;
                            transition:all .2s ease;
                            
                        }
                        
                        .btn-more:hover{
                            background-color:#000;
                            color:#fff;
                        }
                  
                  `
              }
          </style>
      </MainLayout>
  )
}




