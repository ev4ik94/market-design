import {useState, useEffect,useRef} from 'react'
import useHttp from '../../hooks/http.hook';
import Link from "next/link";
import { useRouter } from 'next/router';
import React from 'react';
import {useAuth} from "../../hooks/auth.hook";
import {getCookie, decrypt} from '../../components/secondary-functions';

/*----Redux---*/
import {connect} from 'react-redux';
import {addToCartCookie, addToCartDb} from '../../redux/actions/actionCart';


/*----Components---*/
import ProductShop from "../../components/ProdShop";
import Error from "../../components/Error";
import {Preloader} from "../../components/Preloader";
import SecondBar from '../../components/SecondBar';
import Slider from "react-slick";
import MainLayout from '../../components/MainLayout';





function Product({products:serverProduct, serverErr, addToCartCookie, addToCartDb}) {

    const router = useRouter();
    const [product,setProduct] = useState(null);
    const [categories,setCategories] = useState([]);
    const [mount,setMount] = useState(true);
    const [mountEmail, setMountEmail] = useState(true);
    const {request, loading} = useHttp();
    const [slide1, setSlide1] = useState(null);
    const [slide2, setSlide2] = useState(null);
    const [descriptRead, setDescRead] = useState(false);
    const [reviewsRead, setReviews] = useState(false);
    const [reviews, setRev] = useState([]);
    const [name, setName] = useState('');
    const [emailF,setEmail] = useState('');
    const [text, setText] = useState('');
    const {token, email, userId} = useAuth();
    const [priceCheck, setPrice] = useState('');
    const [successAdd, setSuccess] = useState(false);
    const [alertError, setError] = useState('');
    const [price,setCurrentPrice] = useState('');
    const [catId, setCat] = useState(null);


    const erroR = useHttp().error;


    const texDescript = useRef(null);
    const blockDesc = useRef(null);
    const texReview = useRef(null);
    const blockReview = useRef(null);
    const formReview = useRef(null);
    const headCart = useRef(null);

    const {id} = router.query;



    useEffect(()=>{

            if(!serverProduct) getProducts();
            else {
                if(serverErr===null){
                    setProduct(serverProduct.data);
                    setRev(serverProduct.data?serverProduct.data.review:'');
                    setPrice(serverProduct.data&&serverProduct.data.costs&&serverProduct.data.costs.length?serverProduct.data.costs[0].type:'');
                    setCurrentPrice(serverProduct.data&&serverProduct.data.costs&&serverProduct.data.costs.length?serverProduct.data.costs[0].cost:'');
                    setCat(serverProduct.data&&serverProduct.data.categories?serverProduct.data.categories.id:null);
                }else{
                    setError(serverErr)
                }

            }
            let categories = getCookie('categories')?decrypt(getCookie('categories')?getCookie('categories'):''):[];
            categories = categories.filter(item=>item.title==='shop');
            setCategories(categories.length&&categories[0].children?categories[0].children:[]);

            setMount(false);

    }, [serverProduct]);

    useEffect(()=>{
        if(email!==null && email!=='' && mountEmail){
            setEmail(email)
            setMountEmail(false);
        }
    }, [email]);

    useEffect(()=>{
        if(serverErr!==null){
            if(serverErr===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }
        }
    }, [serverErr])



    const toggleReadMore = (show, height, element)=>{element.style = show?`height:${height}px;`:`height:${''};`};


    const getProducts = async()=>{

        await request(`${process.env.API_URL}/api/products/${id}`).then(result=>{
            setProduct(result.data);
            setRev(result.data.review);
            setPrice(result.data.costs&&result.data.costs.length?result.data.costs[0].type:'');
            setCurrentPrice(result.data.costs&&result.data.costs.length?result.data.costs[0].cost:'');
            setCat(result.data.categories?result.data.categories.id:null);
        }).catch(err=>{
            console.log(err.message)
        })
    }



    const submitReview = async(e)=>{

        e.preventDefault();
        const body = {name,email:emailF,text}

        await request(`${process.env.API_URL}/api/products/review/${id}`, 'POST', body, {
            Authorization: `Bearer ${token}`
        }).then(result=>{

            let arrRev = reviews;
            arrRev.push(result.data);
            setText('');
            setRev(arrRev);

        }).catch(err=>{
            console.log(err.message)
        })

    }

    const addToCart = async()=>{

        const body = {id,type: priceCheck, prod:product};

        if(token && token!==null){
           await addToCartDb(body, userId, token);
            setSuccess(true);

        }else{

            let imgM = product.Images && product.Images.length ? product.Images.filter(item=>item.main): null;
            let img = imgM && imgM!==null && imgM.length?imgM[0].small:process.env.DEFAULT_IMAGE;

            await addToCartCookie({
                id: Date.now(),
                type_cost:priceCheck,
                buy:false,
                Product:{
                    Images:[{small:img}],
                    costs:[{type:priceCheck, cost:price}],
                    id,
                    title: product.title

                }
            });

            setSuccess(true);

        }

    }

    useEffect(()=>{

       if(typeof document !=='undefined'){
           document.addEventListener('scroll', scrollEvent)
       }


    }, []);

    const scrollEvent = ()=>{
        const btn = document.getElementById('cartBtn');
        if(btn && headCart.current!==null){
            let elemTop = document.getElementById('cartBtn').getBoundingClientRect().top;
            if(elemTop<0)headCart.current.style = 'display:flex';
            else headCart.current.style = 'display:none';
        }
    }

    if(loading){
        return(<Preloader />)
    }

    if(!mount && product === null){
        return(
            <MainLayout title={'Title'}>
                <SecondBar categories={categories} />
                <div className="container" style={{minHeight:'400px'}}>
                    <h2 className="text-center mt-3">The requested product was not found!</h2>
                </div>
            </MainLayout>
        )
    }

    if(erroR!==null){
        return(<Error />)
    }


    if(product!==null){
        return (

            <MainLayout title={'Title'}>
                <SecondBar categories={categories} />
                <nav className="navbar navbar-light bg-white position-fixed head-cart justify-content-between" ref={headCart}>
                    <div className="container p-0">
                        <h3 className="font-weight-bold">{product.title?product.title:''}</h3>
                        <div className="add-to-cart">
                            <button className={successAdd?'d-none':'d-block'} onClick={addToCart}>add to card</button>
                            <Link href="/checkout">
                                <a className={successAdd?'d-block':'d-none'}>
                                    checkout now
                                </a>
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <div className="bread-crumbs">
                        <p className="text-uppercase d-flex flex-wrap">
                            you are here: &nbsp;
                            <Link href='/home'><a title="home">home</a></Link>&nbsp; /
                            &nbsp;<Link href='/shop'><a title="shop">shop</a></Link> &nbsp;/
                            &nbsp;<Link href={`/shop?catid=${product.categories?product.categories.id:''}`}>
                            <a title={product.categories?product.categories.title:''}>{product.categories?product.categories.title:''}</a>
                        </Link>&nbsp; /
                            &nbsp;<a href="#" onClick={(e)=>e.preventDefault()} title={product.title?product.title:''}>{product.title?product.title:''}</a>
                        </p>
                    </div>
                    <h1 className="font-weight-bold">{product.title?product.title:''}</h1>

                    <div className="product-content">
                        <div className="top-info-prdt d-flex flex-wrap">
                            <div className="image-product col-12 col-lg-6">
                                <div className="main-view position-relative" data-toggle="modal" data-target="#product-view">
                                    <div className="hover-image position-absolute">
                                        <img src="/icons/glass-white.svg" alt=""/>
                                    </div>
                                    <Slider
                                        asNavFor={slide2}
                                        ref={slider=>setSlide1(slider)}
                                        accessibility={false}
                                        swipeToSlide={false}

                                    >
                                        {
                                            (product.Images&&product.Images.length?product.Images:[]).map(item=>{
                                                return(
                                                    <div key={item.id}>
                                                        <img src={item.small} alt="" className="img-cover"/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Slider>
                                </div>

                                <div className="smll-imgs">
                                    {
                                        product.Images && product.Images.length>1?( <Slider asNavFor={slide1}
                                                                                            ref={slider=>setSlide2(slider)}
                                                                                            slidesToShow={product.Images.length>3?3:2}
                                                                                            swipeToSlide={true}
                                                                                            focusOnSelect={true}

                                        >
                                            {
                                                (product.Images&&product.Images.length?product.Images:[]).map(item=>{
                                                    return(
                                                        <div key={item.id}>
                                                            <img src={item.small} alt=""/>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Slider>):''
                                    }
                                </div>

                            </div>
                            <div className="product-payment-info col-12 col-lg-6">
                                <div className="payment-var">
                                    {
                                        product.costs&&product.costs.length?product.costs.map(item=>{
                                            return(
                                                <div className="item-cost d-flex justify-content-between" key={item.id}>

                                                    <div className="title-cost d-flex">
                                                        <div className="check-box mt-1 mr-3" onClick={()=>{
                                                            setPrice(item.type);
                                                            setCurrentPrice(item.cost);
                                                            setSuccess(false);
                                                        }}>{priceCheck===item.type?(<span>✓</span>):''}</div>
                                                        <p className="mb-0">For {item.type} use</p>
                                                    </div>
                                                    <div className="cost">
                                                        <p  className="mb-0">{item.cost} USD</p>
                                                    </div>
                                                </div>
                                            )
                                        }):''
                                    }
                                </div>
                                <div className="prd-1">
                                    <p className="text-uppercase mb-0 d-flex justify-content-center flex-wrap">need costomization?&nbsp;<Link href="/contacts"><a title="contact us">contact us</a></Link></p>
                                </div>
                                <div className="total-cost d-flex justify-content-between col-10 mx-auto">
                                    <p className="mb-0">Total:</p>
                                    <p className="mb-0"><span>{price}</span> USD</p>
                                </div>
                                <div className="add-to-cart mt-3" id="cartBtn">
                                    <button className={successAdd?'d-none':'d-block'} onClick={addToCart}>add to card</button>
                                    <Link href="/checkout">
                                        <a className={successAdd?'d-block':'d-none'}>
                                            checkout now
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="bot-block-product d-flex flex-wrap mt-5 align-items-baseline">
                            <div className="description-product col-lg-6 col-12">
                                <h3 className="font-weight-bold" style={{color:'#000'}}>Description</h3>
                                <div className={`block-descript position-relative ${product.description && product.description.length>480?'h-200':'h-auto'}`} data-show={descriptRead?'show':'hide'} ref={blockDesc}>
                                    <div className="text-description" ref={texDescript}>
                                        <p>{product.description?product.description:''}</p>
                                    </div>
                                </div>
                                <div className={`read-more-descript mt-3 ${texDescript.current!==null?(product.description && product.description.length>480?'d-block':'d-none'):''}`}>
                                    <button className="font-weight-bold text-uppercase pl-0" onClick={()=>{
                                        const elH = texDescript.current.offsetHeight;
                                        setDescRead(!descriptRead);
                                        toggleReadMore(!descriptRead, elH, blockDesc.current);
                                    }}>{descriptRead?'read less':'read more'}</button>
                                </div>
                            </div>

                            <div className="reviews-product col-lg-6 col-12">
                                <h3 className="font-weight-bold" style={{color:'#000'}}>Customers reviews</h3>
                                <div className={`block-reviews position-relative  ${product.review && product.review.length>3?'h-200':'h-auto'}`} data-show={reviewsRead?'show':'hide'} ref={blockReview}>
                                    <div className="text-reviews" ref={texReview}>
                                        {
                                            reviews.map((item,index)=>(
                                                <div className="item-review" key={index}>
                                                    <h4 className="mb-0 font-weight-bold">{item.name}</h4>
                                                    <div className={`item-text-review mb-3 ${item.text.length>130?'short':''}`}>
                                                        <p className="mb-0">{item.text}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-0">{item.createdAt}</p>
                                                        <div className={`read-more-review ${item.text.length>130?'d-block':'d-none'}`}>
                                                            <button className="text-primary" onClick={(e)=>{
                                                                const parent = e.target.parentElement.parentElement.parentElement;
                                                                const ele = parent.querySelectorAll('.item-text-review')[0];
                                                                ele.classList.remove('short');
                                                                ele.style='height:auto';
                                                                e.target.classList.add('d-none');
                                                            }}>Read More</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className={`read-more-reviews mt-3 ${product.review && product.review.length>3?'d-block':'d-none'}`}>
                                    <button className="font-weight-bold text-uppercase pl-0" onClick={()=>{
                                        const elH = texReview.current.offsetHeight;
                                        setReviews(!reviewsRead);
                                        toggleReadMore(!reviewsRead, elH, blockReview.current);
                                    }}>{reviewsRead?'read less':'read more'}</button>
                                </div>

                                {
                                    token && token!==null?(<><button className="write-review-btn text-uppercase mt-3" onClick={()=>{

                                        if(formReview.current.classList.contains('d-none')){
                                            formReview.current.classList.remove('d-none');
                                        }else{
                                            formReview.current.classList.add('d-none');
                                        }

                                    }}>write a review</button>

                                        <div className="write-review-form col-9 mx-auto pt-5 d-none" ref={formReview}>
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="email-review" className="text-uppercase">Email *</label>
                                                    <input type="email"
                                                           className="form-control"
                                                           id="email-review"
                                                           aria-describedby="emailHelp"
                                                           value={emailF}
                                                           onChange={(e)=>setEmail(e.target.value)}
                                                    />

                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputName" className="text-uppercase">name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="exampleInputName"
                                                        value={name}
                                                        onChange={(e)=>setName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleFormControlTextarea1" className="text-uppercase">body of review *</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        rows="5"
                                                        value={text}
                                                        onChange={(e)=>setText(e.target.value)}
                                                    ></textarea>
                                                </div>
                                                <button type="submit" className="btn text-uppercase" onClick={submitReview}>submit review</button>
                                            </form>
                                        </div></>):''
                                }
                            </div>
                        </div>
                    </div>

                    <ul className="tag-list d-flex mt-5">
                        <li className="text-uppercase">tags:</li>
                        {
                            product.tags?product.tags.map(item=>(
                                <li key={item.id} className="text-uppercase pl-3">
                                    <Link href={`/shop?tag=${item.title}`}>
                                        <a>
                                            {item.title}
                                        </a>
                                    </Link>
                                </li>
                            )):''
                        }
                    </ul>
                    {catId!==null?(<AlsoLike catid={catId} id={id}/>):''}
                    <Modal product={product}/>
                </div>



                <style jsx>
                    {
                        `
                        
                                           
                        .head-cart{
                            top:0;
                            left:0;
                            right:0;
                            z-index:10;
                            border-bottom:1px solid #f2ede8;
                            display:none;
                           
                        }
                        
                        
                        .bread-crumbs{
                            padding: 1rem;
                        }
                        
                        .bread-crumbs a{
                            color:#000;
                            text-decoration:none;
                            letter-spacing: .1em;
                        }
                        
                        .bread-crumbs a:before{
                            content:attr(title);
                            font-weight:bold;
                            height:0;
                            overflow:hidden;
                            display:block;
                        }
                        
                        .bread-crumbs a:hover{
                            font-weight:bold;
                        }
                        
                        .bread-crumbs a:last-child:hover{
                            font-weight:normal;
                        }
                        
                        h1{
                            color:#000;
                            padding:.5rem 1rem 1rem;
                        }
                        
                        .item-cost .check-box{
                            width:25px;
                            height:25px;
                            border:1px solid #000;
                            padding:0px 5px;
                            cursor:pointer;
                            
                        }
                        
                        .item-cost .check-box span{
                            font-size:1.2rem;
                            margin:0 auto;
                        }
                        
                        .item-cost p{
                            font-size:1.3rem;
                            letter-spacing: .1em;
                        }
                        
                        .item-cost{
                            padding: 15px 5px;
                        }
                        
                        .item-cost:first-child{
                            padding-top:0;
                        }
                        
                        .cost p{font-size:1.5rem;}
                        
                        .prd-1{
                            padding: 1rem .5rem .8rem;
                            border-bottom: 1px solid #dedede;
                        }
                        
                        .prd-1 p{
                            color:#000;
                            letter-spacing: .1em;
                            font-size:1rem;
                        }
                        
                        .prd-1 a{
                            color:#000;
                            text-decoration:underline;
                        }
                        
                        .prd-1 a:before{
                            content:attr(title);
                            display:block;
                            font-weight:bold;
                            height:0;
                            overflow:hidden;
                        }
                        
                        .prd-1 a:hover{
                            font-weight:bold;
                        }
                        
                        .total-cost {
                            padding: 1rem;
                            font-size:1.6rem;
                        }
                        
                        .total-cost p{
                            letter-spacing: .1em;
                        }
                        
                        .add-to-cart button,
                        .add-to-cart a{
                            
                            color: #fff;
                            
                            outline: none;
                            box-shadow: none;
                            padding: 20px 60px;
                            font-size: 1rem;
                            float: right;
                            text-transform:uppercase;
                            letter-spacing: .08em;
                            transition:all .6s ease;
                        }
                        
                        .add-to-cart button{
                            background: #7cb342;
                            border: 1px solid #7cb342;
                        }
                        
                        .add-to-cart a{
                            background: #f98e3c;
                            border: 1px solid #f98e3c;
                        }
                        
                        .add-to-cart a:hover{
                            text-decoration:none;
                        }
                        
                        .add-to-cart button:hover{
                            background: #95d64c;
                            border-color: #95d64c;
                        }
                        
                        .hover-image{
                            z-index: 3;
                            width: 90px;
                            height: 90px;
                            background-color: rgba(0,0,0,.3);
                            border-radius: 50%;
                            padding: 20px;
                            left: 40%;
                            top: 35%;
                            opacity:0;
                            transition:all .4s ease;

                        }
                        
                        .top-info-prdt .main-view:hover .hover-image{
                            opacity:1;
                          
                        }
                        
                        .top-info-prdt .main-view:hover{cursor:pointer;}
                        
                       .total-cost p>span{font-size:2rem;}
                        
                        
                     
                        .text-description p,
                        .text-reviews p{
                            font-size: 18px;
                            line-height: 1.61111em;
                        }
                        
                        .read-more-descript button,
                        .read-more-reviews button{
                            color:#8ba753;
                            background-color:transparent;
                            border:transparent;
                            outline:none;
                            font-size:1.3rem;
                            
                        }
                        
                        .description-product .h-200[data-show='hide']:after,
                        .reviews-product .h-200[data-show='hide']:after
                        {
                            content:'';
                            background: linear-gradient(to bottom,rgba(255,255,255,0),#fff);
                            position:absolute;
                            bottom:0;
                            height:100px;
                            width:100%;
                            display:block;
                        }
                        
                        .block-descript,
                        .block-reviews{
                            height: 200px;
                            overflow: hidden;
                            transition:height .6s ease;
                        }
                        
                        .h-200{height: 200px;}
                        .h-aut{height: auto;}
                        
                        .reviews-product{border-left:1px solid #dedede;}
                        
                        .item-review{padding:10px;}
                        
                        .item-review .short{
                            height: 50px;
                            overflow: hidden;
                            transition:height .6s ease;
                        }
                        
                        .item-review .short p{
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            text-overflow: ellipsis;
                        }
                        
                        .read-more-review button{
                            background-color: transparent;
                            border: none;
                            font-size: .9rem;
                            font-weight: bold;
                             outline:none;
                        }
                        
                        .write-review-btn,
                        .write-review-form .btn{
                            border:1px solid #000;
                            outline:none;
                            background-color:transparent;
                            color:#000;
                            padding: 15px 25px;
                            transition:all .6s ease;
                            border-radius:0;
                           
                        }
                        
                        .write-review-form .btn{
                            float:right;
                        }
                        
                        .write-review-btn:hover,
                        .write-review-form .btn:hover{
                            background-color:#000;
                            color:#fff;
                        }
                        
                        .write-review-form input,
                        .write-review-form textarea{
                            border:1px solid #dedede;
                            outline:none;
                            box-shadow:none;
                            border-radius:0;
                            color:#263238;
                        }
                        
                        .write-review-form input{height:50px;}
                        
                        .write-review-form input:hover,
                        .write-review-form textarea:hover{
                            border-color:#000;
                        }
                        
                        .write-review-form label{letter-spacing: .08em;}
                        
                        .tag-list{
                            padding:15px;
                            border-bottom:1px solid #dedede;
                            border-top:1px solid #dedede;
                        }
                        
                        .tag-list li{letter-spacing:.1em;}
                        
                        .tag-list a{color:#000;}
                        
                        @media screen and (min-width: 500px) and (max-width: 991px) {
                           .product-payment-info {padding-top:15px;}
                        }
                        
                        @media screen and (min-width: 400px) and (max-width: 500px) {
                            .product-payment-info {padding-top:15px;}
                            
                            .item-cost .title-cost > p{font-size:1.1rem;}
                            
                            .payment-var p{padding-top:5px;}
                            
                            .item-cost .cost > p{font-size:1.3rem;}
                            
                            .prd-1 > p,
                            .text-description >p,
                            .text-reviews > p
                            {font-size:1rem;}
                            
                            .total-cost > p, h3{font-size:1.4rem;}
                            
                            .total-cost > p >span{font-size:1.5rem;}
                            
                            
                            
                           
                        }
                        
                        @media screen and (min-width: 335px) and (max-width: 380px) {
                        
                            .product-payment-info {padding-top:15px;}
                            
                            .item-cost .title-cost > p,
                            .item-cost .check-box > span,
                            .bread-crumbs > p
                            {font-size:.9rem;}
                            
                            h1{font-size:2rem;}
                            
                            .payment-var p{padding-top:5px;}
                            
                            .item-cost .cost > p{font-size:1rem;}
                            
                            .prd-1 > p{font-size:.8rem;}
                            
                            .text-description >p,
                            .text-reviews > p{font-size:1rem;}
                            
                            .total-cost > p, h3 {font-size:1.2rem;}
                            
                            .total-cost > p >span{font-size:1.3rem;}
                            
                            .item-cost .check-box{
                                width:20px;
                                height:20px;
                                padding: 0px 3px;
                            }
                            
                            .add-to-cart button,
                            .add-to-cart a{
                                float: none;
                                text-align:center;
                                width: 100%;
                            }
                            
                            
                            
                            
                        }
                        
                        @media screen and (min-width: 0px) and (max-width: 335px) {
                            .product-payment-info {padding-top:15px;}
                            
                            .item-cost .title-cost > p,
                            .item-cost .check-box > span
                            {font-size:.8rem;}
                            
                            .payment-var p{padding-top:5px;}
                            
                            .item-cost .cost > p{font-size:.9rem;}
                            
                            .prd-1 > p{font-size:.8rem;}
                            
                            .total-cost > p, h3 {font-size:1.2rem;}
                            
                            .total-cost > p >span{font-size:1.3rem;}
                            
                            .item-cost .check-box{
                                width:20px;
                                height:20px;
                                padding: 0px 3px;
                            }
                            
                             .add-to-cart button,
                            .add-to-cart a{
                                float: none;
                                text-align:center;
                                font-size:.9rem;
                            }
                        }
                        
                        
                        
                  
                  `
                    }
                </style>
            </MainLayout>
        )
    }

    return(
        <>
        </>
    )

}

function AlsoLike({id,catid}){

    const [products, setProducts] = useState([]);
    const {request} = useHttp();
    //const [mount, setMount] = useState(true);


    const getProducts = async()=>{
        await request(`${process.env.API_URL}/api/products/productCategory/${id}/${catid}`).then(result=>{

            setProducts(result.data)

        }).catch(err=>{
            console.log(err.message)
        })
    };

    useEffect(()=>{
        getProducts()

    },[id]);




    return(
        <div className="mt-5">
            <h2 className="text-uppercase text-center mb-3 font-weight-bold">you can also like</h2>
            {products.length?(<ProductShop products={products}/>):''}
            <Link href="/shop">
                <a className="text-uppercase d-block mx-auto text-center">back to shop</a>
            </Link>

            <style jsx>
                {
                    `
                    
                   
                        a{
                            color:#000;
                            padding:15px 20px;
                            border:1px solid #000;
                            width:180px;
                            transition:all .5s ease;
                            text-decoration:none;
                            letter-spacing:.1em;
                            
                            
                                                   
                        }
                        
                        h2{letter-spacing:.1em;}
                        
                        a:hover{
                            color:#fff;
                            background-color:#000;
                        }
                        
                        
                        
                        
                    `
                }
            </style>
        </div>
    )
}

function Modal({product}){

    const [slider, setSlider] = useState(null);

    const goToSlide = (index)=>{
        slider.slickGoTo(index);
    };


    return(
        <div className="modal fade" id="product-view" tabIndex="-1" aria-labelledby="product-view"
             aria-hidden="true">
            <div className="modal-dialog  m-0 modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-body pr-0">

                        <div className="main-wrap d-flex justify-content-between">


                        <div className="main-view col-9">
                            <Slider

                                ref={slider=>setSlider(slider)}
                                accessibility={false}
                                swipeToSlide={false}

                            >
                                {
                                    (product.Images&&product.Images.length?product.Images:[]).map(item=>{
                                        return(
                                            <div key={item.id}>
                                                <img src={item.large} alt="" className="img-cover"/>
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        </div>

                        <div className="smll-imgs col-3">
                           <div className="btn-close-modal d-flex justify-content-end">
                               <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                   <span aria-hidden="true">&times;</span>
                               </button>
                           </div>
                            <div className="sliders-nav-imgs">
                                {
                                    (product.Images&&product.Images.length?product.Images:[]).map((item,index)=>{
                                        return(
                                            <div key={item.id} onClick={()=>goToSlide(index)}>
                                                <img src={item.small} alt=""/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .modal-dialog{
                    max-width:100vw;
                }
                
             
                .sliders-nav-imgs{
                    height:100%;
                    overflow-y:scroll;                
                }
                .sliders-nav-imgs >div{
                    padding:5px 10px;
                }
                
                .modal-content{
                    height:98vh;
                    background-color:transparent;
                    border:none;
                }
                
                .btn-close-modal{
                    padding:5px 0px;
                }
                
                .btn-close-modal button{
                    width:40px;
                    height:40px;
                    background-color:white;
                    box-shadow:1px 1px 3px #000;
                    display:block!important;
                    opacity:1!important;
                    font-size:2rem;
                    font-weight:normal;
                    outline:none;
                    color:#8e8e8e;
                }
                
               
            
            `}</style>
        </div>
    )
}




export async function getServerSideProps(ctx){

    const {id} = ctx.query;
    const response = await fetch(`${process.env.API_URL}/api/products/${id}`)
    const error = await response.status > 201 ?response.status:null;

    const post = error!==null?null:await response.json();


    return {
        props:{products:post, serverErr:error}
    }
}

const mapStateToProps = state => ({
    cart: state
});

const mapDispatchToProps = {
    addToCartCookie,
    addToCartDb
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);






