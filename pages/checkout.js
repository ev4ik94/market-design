import {useState, useEffect} from 'react'
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import MainLayout from '../components/MainLayout';
import {useAuth} from "../hooks/auth.hook";

/*----Redux---*/
import {connect} from 'react-redux';
import {getCart} from '../redux/actions/actionCart';


/*----Components---*/
import {Preloader} from "../components/Preloader";
import Error from '../components/Error';
import {FormPayment} from '../components/checkout/FormPayment';

/*----functions----*/
import {getCookie, decrypt, createCookie, encrypt} from "../components/secondary-functions";


/*----Styles-----*/
import classes from '../styles/views/checkout.module.css'







function Checkout({cart,getCart}) {

    const {request, loading, error} = useHttp();
    const [products, setProduct] = useState([]);
    const [mount, setMount] = useState(true);
    const {token, userId} = useAuth();
    const [totalCost, setCost] = useState('');

    useEffect(()=>{

        if(mount){

            if(token!==null){
                getCart();
            }else{
                let pr = getCookie('_pr_c');
                let dcrObj = pr && pr!==null?decrypt(pr):[];

                setProduct(dcrObj);
                totalCostF(dcrObj)

            }
            setTimeout(()=>{setMount(false)}, 500);
        }

    }, [mount, token]);

    useEffect(()=>{
        if(cart && cart.cart){
            if(cart.cart!==null && cart.cart.length){
                setProduct(cart.cart);
                totalCostF(cart.cart)
            }
        }

    }, [cart])

    const totalCostF = (obj)=>{
        let total = 0;

        for(let value of obj){
            let cost = value.Product?value.Product.costs.filter(cost=>cost.type===value.type_cost):0;
            cost = cost.length?cost[0].cost:'';
            total += Number(cost);
        }
        setCost(total);
    }

    const removeProduct = async(id)=>{

        if(token!==null){
            let a = products.length?products.filter(item=>item.id!==id):[];
            await request(`${process.env.API_URL}/api/products/cart/${userId}/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                    setProduct(a);
                    totalCostF(a)
                })
                .catch(err=>{console.log(err.message)})
        }else{


            if(id){
                let prodArr = products.length?products.filter(item=>item.id?item.id!==id:item.Product.id!==id):[];
                setProduct(prodArr)
                prodArr = encrypt(prodArr);
                createCookie('_pr_c', prodArr);
                getCart()
            }

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
            <div className={`container ${classes['wrap-checkout-content']}`}>
                <h2 className={`font-weight-bold text-center text-uppercase pb-3 ${classes['h2-checkout']}`}>checkout</h2>
                <div className={`${classes['bread-crumbs']} d-flex mt-3`}>
                    <p className="text-uppercase">you are here: </p>&nbsp;
                    <Link href="/home"><a className="text-uppercase" title="home">home</a></Link>&nbsp;
                    /&nbsp;
                    <p className="text-uppercase">checkout</p>
                </div>
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
                                                    <div className={`${classes['img-product']} h-100`}>
                                                        <img src={item.Product && item.Product.Images?(item.Product.Images.main?item.Product.Images.small:item.Product.Images[0].small):process.env.DEFAULT_IMAGE} alt={item.title?item.title:''} className="img-cover"/>
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
                                            <div className="mt-3">
                                                <button className="text-uppercase" onClick={()=>removeProduct(item.id)}>remove</button>
                                                <p className="mt-1 mb-0">{cost} USD</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className={`d-flex justify-content-between ${classes['totalCost']} col-6 float-right`}>
                            <p className="font-weight-bold">Total</p>
                            <p  className="font-weight-bold">{totalCost} <span>USD</span></p>
                        </div>
                        <FormPayment />
                    </>):(<div style={{minHeight:"400px"}}><p className="text-center" style={{fontSize:'2rem'}}>Cart is empty!</p></div>)
                }

            </div>

        </MainLayout>
    )
}


const mapStateToProps = state => ({
    cart: state
});

const mapDispatchToProps = {
    getCart
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);


