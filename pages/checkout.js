import Head from 'next/head'
import {useState, useEffect} from 'react'
import MainLayout from '../components/MainLayout';
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import {getCookie, decrypt, createCookie, encrypt} from "../components/secondary-functions";
import { useRouter } from 'next/router';
import {useAuth} from "../hooks/auth.hook";
import Preloader from "../components/Preloader";
import Error from '../components/Error';


export default function Checkout() {

    const router = useRouter()
    const {request, loading, error} = useHttp();
    const [products, setProduct] = useState([]);
    const [mount, setMount] = useState(true);
    const {token, userId} = useAuth();
    const [totalCost, setCost] = useState('');

    useEffect(()=>{

        if(mount){

            if(token!==null){
                getCartDb();
            }else{
                let pr = getCookie('_pr_c');
                let dcrObj = pr && pr!==null?decrypt(pr):[];

                setProduct(dcrObj);
                totalCostF(dcrObj)

            }
            setTimeout(()=>{setMount(false)}, 500);
        }

    }, [mount, token]);

    const totalCostF = (obj)=>{
        let total = 0;

        for(let value of obj){
            let cost = value.Product.costs.filter(cost=>cost.type===value.type_cost);
            cost = cost.length?cost[0].cost:'';
            total += Number(cost);
        }
        setCost(total);
    }


    const getCartDb = async()=>{
        await request(`${process.env.API_URL}/api/products/cart/${userId}`, 'GET', null, {
            Authorization: `Bearer ${token}`
        })
            .then(result=>{
                setProduct(result.data);
                totalCostF(result.data)
            })
            .catch(err=>{console.log(err.message)})
    };

    const removeProduct = async(id)=>{

        if(token!==null){
            await request(`${process.env.API_URL}/api/products/cart/${userId}/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${token}`
            })
                .then(result=>{

                    let newProd = products.length?products.filter(item=>item.id!==id):[];
                    setProduct(newProd);
                    totalCostF(newProd)
                    console.log(result);
                })
                .catch(err=>{console.log(err.message)})
        }else{

            let prodArr = products.length?products.filter(item=>item.id!==id):[];
            setProduct(prodArr)
            prodArr = encrypt(prodArr);
            createCookie('_pr_c', prodArr)
        }
    }



    if(loading){
        return(<Preloader />)
    }

    if(error!==null){
        return(<Error />)
    }



    return (
        <MainLayout title={'Title'}>
            <div className="container">
                <h2 className="font-weight-bold text-center text-uppercase pb-3">checkout</h2>
                <div className="bread-crumbs d-flex mt-3">
                    <p className="text-uppercase">you are here: </p>&nbsp;
                    <Link href="/home"><a className="text-uppercase" title="home">home</a></Link>&nbsp;
                    /&nbsp;
                    <p className="text-uppercase">checkout</p>
                </div>
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
                                            <div className="mt-3">
                                                <button className="text-uppercase" onClick={()=>removeProduct(item.id)}>remove</button>
                                                <p className="mt-1 mb-0">{cost} USD</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="d-flex justify-content-between totalCost col-6 float-right">
                            <p className="font-weight-bold">Total</p>
                            <p  className="font-weight-bold">{totalCost} <span style={{fontSize:'1.5rem'}}>USD</span></p>
                        </div>
                        <FormPayment />
                    </>):(<div style={{minHeight:"400px"}}><p className="text-center" style={{fontSize:'2rem'}}>Cart is empty!</p></div>)
                }

            </div>
            <style jsx>
                {
                    `
                        h2{
                            border-bottom:1px solid #f2ede8;
                        }
                        
                        .product-item h2{
                            border:none;
                            color:#000;
                        }
                        
                        .product-item > div:last-child p{
                            font-size:1.8rem;
                        }
                        
                        .bread-crumbs a{
                            text-decoration:none;
                            color:#263238;
                            letter-spacing:.05em;
                        }
                        
                        .bread-crumbs a:hover{
                            font-weight:bold;
                        }
                        
                        .bread-crumbs a:before{
                            content:attr(title);
                            font-weight:bold;
                            height:0;
                            overflow:hidden;
                            display:block;
                        }
                        
                       
                         .bread-crumbs p{letter-spacing:.05em;}
                         
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
                        
                        .checkout-btn{
                            border:none;
                            outline:none;
                            background-color:#7cb342;
                            color:#fff;
                            transition:all .4s ease;
                        }
                        
                        .checkout-btn:hover{
                            background-color:#95d64c;
                        }
                        
                  
                  `
                }
            </style>
        </MainLayout>
    )
}


function FormPayment(){

    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');

    return(
        <div style={{marginTop:'150px'}}>
            <h3 className="font-weight-bold">Contact information</h3>
            <div className="forms-block d-flex justify-content-between mt-5">
                <form className="col-5">
                    <div className="form-group">
                        <label htmlFor="inputNamePayment" value={name} onChange={(e)=>{setName(e.target.value)}}>first name *</label>
                        <input type="text" className="form-control" id="inputNamePayment"
                               aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastNamePayment" value={lastName} onChange={(e)=>{setLastName(e.target.value)}}>last name *</label>
                        <input type="text" className="form-control" id="lastNamePayment" />
                    </div>

                </form>

                <form className="col-5">
                    <div className="form-group">
                        <label htmlFor="inputCountryPay" value={country} onChange={(e)=>{setCountry(e.target.value)}}>country *</label>
                        <input type="text" className="form-control" id="inputCountryPay"
                               aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputStatePayment" value={state} onChange={(e)=>{setState(e.target.value)}}>state/province *</label>
                        <input type="text" className="form-control" id="inputStatePayment" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputCityPayment" value={city} onChange={(e)=>{setCity(e.target.value)}}>city *</label>
                        <input type="text" className="form-control" id="inputCityPayment" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddresspayment" value={address} onChange={(e)=>{setAddress(e.target.value)}}>street address *</label>
                        <input type="text" className="form-control" id="inputAddresspayment" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postCodepayment" value={postCode} onChange={(e)=>{setpostCode(e.target.value)}}>zip/postal code *</label>
                        <input type="text" className="form-control" id="postCodepayment" />
                    </div>

                </form>
            </div>
            <button className="checkout-btn text-uppercase float-right">continue checkout</button>

            <style jsx>
                {
                    `
                                              
                        .checkout-btn{
                            border:none;
                            outline:none;
                            background-color:#7cb342;
                            color:#fff;
                            transition:all .4s ease;
                            padding: 15px 20px;
                            margin-right: 15px;
                        }
                        
                        .checkout-btn:hover{
                            background-color:#95d64c;
                        }
                        
                  
                  `
                }
            </style>
        </div>
    )
}
