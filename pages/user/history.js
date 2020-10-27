import {useState, useEffect} from 'react'
import MainLayout from '../../components/MainLayout';
import useHttp from '../../hooks/http.hook';
import Link from "next/link";
import {decrypt} from "../../components/secondary-functions";
import {useAuth} from "../../hooks/auth.hook";
import NavUsers from '../../components/user/navUser';
import {Preloader} from "../../components/Preloader";


export default function History({history:serverUser, serverErr}) {

    const {request, loading} = useHttp();
    const [mount, setMount] = useState(true);
    const {token, userId, email, logout} = useAuth();
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);



    useEffect(()=>{

        if(mount){
            if(!serverUser){
                if(token && token!==null){
                    getCart();
                }
            }
            else{
                if(serverErr===null){
                    setProducts(serverUser.data)
                }else{
                    if(serverErr===401) logout();
                    setError(serverErr);
                }

            }
            setMount(false);
        }

    }, [mount])

    useEffect(()=>{
        if(serverErr!==null){
            if(serverErr===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }
        }
    }, [serverErr])

    const getCart = async()=>{
        await request(`${process.env.API_URL}/api/products/cart/${userId}/true`, null, {
            Authorization: `Bearer ${token}`
        })
            .then(result=>{
                if(result.data){

                    setProducts(serverUser.data)
                }
            })
    };

    if(loading){
        return(<Preloader />)
    }


    return (
        <MainLayout title={'Title'}>
            {
                token && token!==null?(
                    <>
                        <NavUsers />
                        <div className="container">
                            <div className="title-head">
                                <h1 className="font-weight-bold text-center text-uppercase">{email && email!==null?email:''}</h1>
                            </div>
                            {
                                error!==''?(<div className="error-message mb-3">
                                    <p className="text-center mb-0">{error}</p>
                                </div>):''
                            }

                            <div className="block-address-info mt-5">
                                {
                                    products.length?(<>
                                        <div className="products-list mt-3">
                                            {
                                                products.map((item, index)=>{
                                                    let costType = item.Product.costs.filter(cost=>cost.type===item.type_cost);
                                                    let cost = item.Product.costs.filter(cost=>cost.type===item.type_cost);
                                                    costType = costType.length?costType[0].type:'';
                                                    cost = cost.length?cost[0].cost:'';

                                                    return(
                                                        <div className="product-item d-flex mb-5" key={index}>
                                                            <Link href="/shop-products/[id]" as={`/shop-products/${item.Product.id}`}>
                                                                <a className="col-3 pl-0">
                                                                    <div className="img-product">
                                                                        <img src={item.Product && item.Product.Images?(item.Product.Images.main?item.Product.Images.small:item.Product.Images[0].small):process.env.DEFAULT_IMAGE} alt={item.title?item.title:''} />
                                                                    </div>
                                                                </a>

                                                            </Link>
                                                            <div className="info-product col-6 pt-5">
                                                                <Link href="/shop-products/[id]" as={`/shop-products/${item.Product.id}`}>
                                                                    <a>
                                                                        <h2 className="font-weight">{item.Product && item.Product.title?item.Product.title:''}</h2>
                                                                    </a>
                                                                </Link>
                                                                <p className="font-weight-bold">For {costType} use</p>
                                                            </div>
                                                            <div className="mt-5">
                                                                <p className="mb-0">{cost} USD</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>


                                    </>):(<div style={{minHeight:"400px"}}><p className="text-center" style={{fontSize:'2rem'}}>Your purchase history is empty!</p></div>)
                                }

                            </div>
                        </div>
                    </>
                ):(<div style={{minHeight:'400px'}}>
                    <div className="title-head col-6 mx-auto">
                        <h1 className="font-weight-bold text-center mb-0 mt-5">ACCESS DENIED</h1>
                    </div>
                    <p className="text-center mt-3">You are not authorized to access this page.</p>
                </div>)
            }

            <style jsx>
                {
                    `
                      .title-head{
                        padding:10px;
                        border-bottom:1px solid #f2ede8;
                      }
                      
                      .product-item h2{
                            border:none;
                            color:#000;
                        }
                        
                        .product-item > div:last-child p{
                            font-size:1.8rem;
                        }
                        
                                                
                         .product-item{ 
                            border:1px solid #e8e8e8;
                            cursor:pointer;
                         }
                         
                        .info-product p{font-size:1.2rem;}
                        
                        .product-item > div:last-child button{
                            border:none;
                            background-color:transparent;
                            outline:none;
                            font-size:1.2rem;
                            opacity:0;
                            transition:all .5s ease;
                        }
                        
                        .product-item > div:last-child button:hover{
                            text-decoration:underline;
                        }
                        
                        .product-item:hover > div:last-child button{
                            opacity:1;
                        }
                        
                        .totalCost p{
                            font-size:2rem;
                        }
                        
                        .img-product:hover img{
                            opacity:.5;
                        }
                        
                        a{
                            text-decoration:none!important;
                        }
                                      
                  
                  `
                }
            </style>
        </MainLayout>
    )
}


export async function getServerSideProps(ctx){

    if(ctx.req.headers.cookie){
        let cookie = ctx.req.headers.cookie.split(';').filter(item=>item.indexOf('users')>0);
        let ind = cookie.length && cookie[0].indexOf('=')>0?cookie[0].indexOf('='):null;

        if(cookie.length && ind!==null){
            let users = decrypt(cookie[0].slice(ind+1));

            const response = await fetch(`${process.env.API_URL}/api/products/cart/${users.userId}/true`, {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${users.token}`
                }
            })


           if(!response.ok){
               return{
                   props:{history:null, serverErr:response.status}
               }
           }

            const cart = await response.json();


            return {
                props:{history:cart, serverErr:null}
            }
        }

    }
    return {
        props:{history:null, serverErr:'Something went wrong'}
    }


}

