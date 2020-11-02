import {useState, useEffect} from 'react'
import MainLayout from '../../components/MainLayout';
import useHttp from '../../hooks/http.hook';
import Link from "next/link";
import {decrypt} from "../../components/secondary-functions";
import {useAuth} from "../../hooks/auth.hook";
import NavUsers from '../../components/user/navUser';
import {Preloader} from "../../components/Preloader";

import classes from '../../styles/views/history.module.css'


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
                            <div className={`${classes['title-head']}`}>
                                <h1 className="font-weight-bold text-center text-uppercase">{email && email!==null?email:''}</h1>
                            </div>
                            {
                                error!==''?(<div className="error-message mb-3">
                                    <p className="text-center mb-0">{error}</p>
                                </div>):''
                            }

                            <div className={`${classes['block-address-info']} mt-5`}>
                                {
                                    products.length?(<>
                                        <div className={`${classes['products-list']} mt-3`}>
                                            {
                                                products.map((item, index)=>{
                                                    let costType = item.Product.costs.filter(cost=>cost.type===item.type_cost);
                                                    let cost = item.Product.costs.filter(cost=>cost.type===item.type_cost);
                                                    costType = costType.length?costType[0].type:'';
                                                    cost = cost.length?cost[0].cost:'';

                                                    return(
                                                        <div className={`${classes['product-item']} d-flex flex-lg-row flex-sm-row flex-column mb-5`} key={index}>
                                                            <Link href="/shop-products/[id]" as={`/shop-products/${item.Product.id}`}>
                                                                <a className="col-lg-3 col-6 col-sm-5 pl-0">
                                                                    <div className="img-product">
                                                                        <img src={item.Product && item.Product.Images?(item.Product.Images.main?item.Product.Images.small:item.Product.Images[0].small):process.env.DEFAULT_IMAGE} alt={item.title?item.title:''} />
                                                                    </div>
                                                                </a>

                                                            </Link>
                                                            <div className={`${classes['info-product']} col-lg-6 col-12 col-sm-5 pt-lg-5 pt-sm-5 pt-3`}>
                                                                <Link href="/shop-products/[id]" as={`/shop-products/${item.Product.id}`}>
                                                                    <a>
                                                                        <h2 className="font-weight">{item.Product && item.Product.title?item.Product.title:''}</h2>
                                                                    </a>
                                                                </Link>
                                                                <p className="font-weight-bold">For {costType} use</p>
                                                            </div>
                                                            <div className="mt-lg-5 mt-md-5 mt-sm-5 mt-1">
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
                    <div className={`${classes['title-head']} col-6 mx-auto`}>
                        <h1 className="font-weight-bold text-center mb-0 mt-5">ACCESS DENIED</h1>
                    </div>
                    <p className="text-center mt-3">You are not authorized to access this page.</p>
                </div>)
            }

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

