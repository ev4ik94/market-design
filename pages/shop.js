import {useState, useEffect} from 'react'
import MainLayout from '../components/MainLayout';
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import {getCookie, decrypt, paginationCalc} from "../components/secondary-functions";
import ProdShop from "../components/ProdShop";
import { useRouter } from 'next/router';
import SecondBar from '../components/SecondBar';
import {Preloader} from '../components/Preloader';
import Error from '../components/Error';

export default function Shop({products:serverProduct, serverError}) {

    const router = useRouter()
    const {request, loading, error} = useHttp();
    const [productsGet, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dropdown, setDropdown] = useState('default');
    const [pagination, setPagintaion] = useState([]);

    const {catid,page,s, tag} = router.query;


    useEffect(()=>{
        if(!s){
            setDropdown('default')
            if(!serverProduct) getProducts();
            else{
                if(serverError===null){
                    setProducts(serverProduct.data&&serverProduct.data.rows?serverProduct.data.rows:[]);
                    paginationCalc(serverProduct.data&&serverProduct.data.count?serverProduct.data.count:0, 27,setPagintaion);
                }
            }
        }


    }, [catid]);

    useEffect(()=>{
      if(s){
          getResult();
      }else{
          setDropdown('default')
          getProducts();
      }

    }, [s]);


    useEffect(()=>{
        if(!categories.length){

            let cookieCat = getCookie('categories') && getCookie('categories')!==null ? getCookie('categories'):null;
            cookieCat = cookieCat!==null?decrypt(cookieCat):[];
            let categories = cookieCat.filter(item=>item.title===router.pathname.replace('/',''));

            setCategories(categories.length&&categories[0].children?categories[0].children:[]);
        }
    }, [categories]);

    useEffect(()=>{

        if(serverError!==null){
            if(serverError===404){
                return window.location.href = `${process.env.API_URL}/404`;
            }
        }
    }, [serverError])




    const getResult = async()=>{
        let params = router.query.s?router.query.s.replace('-', ' '):null;

        if(params!==null){
            await request(`${process.env.API_URL}/api/search/${params}`).then(result=>{
                let data = [];

                for(let value in result.data){
                    if(result.data[value].products){
                        result.data[value].products.forEach(item=>data.push(item))
                    }else{
                        data.push(result.data[value])
                    }
                }

                setProducts(data)

            }).catch(err=>{console.log(err.message)})
        }


    }


    const getProducts = async(recent=false,popular=false)=>{


        await request(`${process.env.API_URL}/api/products?page=${page?page:1}&limit=28&${catid?'catid='+catid:'parentid=1'}${recent?'&recent=1':'&recent=0'}${popular?'&popular=1':'&popular=0'}${tag?'&tag='+tag:''}`).then(result=>{
            setProducts(result.data&&result.data.rows?result.data.rows:[]);
            paginationCalc(result.data&&result.data.count?result.data.count:0, 27,setPagintaion);
        }).catch(err=>{console.log(err.message)})
    }

    const filterProduct = (e)=>{
        e.preventDefault();
        let val = e.target.getAttribute('href');
        setDropdown(val);
        switch (val){
            case'recent':
                getProducts(true);
                break;
            case'popular':
                getProducts(false,true);
                break;
            default:
                getProducts(false,false);
                break;
        }
    }


    let pg = page?Number(page):0,
        next = `${catid?'?catid='+catid:''}`+`${catid?'&page='+(pg+1):'?page='+(pg+1)}`,
        prev = `${catid?'?catid='+catid:''}`+`${catid?((pg-1)===0?'':'&page='+(pg-1)):((pg-1)===0?'':'?page='+(pg-1))}`;

    if(loading){
        return(<Preloader />)
    }

    if(error!==null){
        return(<Error />)
    }





    return (
        <MainLayout title={'Title'}>

            <SecondBar categories={categories} />

            {
                s ?(<div className="container pt-3 bp-3" style={{fontSize:'1.3rem'}}>

                    <p>Searching results for:&nbsp; <span className="font-weight-bold">{s}</span></p>
                </div>):(<div style={{padding:'35px 25px 10px'}} className="mb-3 container">
                    <p className="text-uppercase d-flex mb-0">you are here: <Link href="/">
                        <a className="nav-link">home</a>
                    </Link> / shop</p>
                    <div className="dropdown d-flex justify-content-lg-end justify-content-start">
                        <a className="dropdown-toggle text-uppercase d-block" href="#" role="button" id="dropdownMenuLink"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {dropdown}
                        </a>

                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a className="dropdown-item text-uppercase" href="default" onClick={filterProduct}>default</a>
                            <a className="dropdown-item text-uppercase" href="popular" onClick={filterProduct}>popular</a>
                            <a className="dropdown-item text-uppercase" href="recent" onClick={filterProduct}>recent</a>
                        </div>
                    </div>
                </div>)
            }

            <ProdShop products={productsGet} minHeight={'500px'}/>

            {
                router.query.s?(''):(<nav aria-label="Page navigation example">
                    <ul className={productsGet.length?'pagination justify-content-center':'d-none'}>
                        <li className={page&&Number(page)>0?'page-item':'d-none'}>
                            <Link href={`/shop${prev}`}>
                                <a className="page-link" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </a>
                            </Link>
                        </li>
                        {
                            pagination.map(item=>{

                                let path = `${catid?'?catid='+catid:'?'}`+`${catid?'&page='+item:'page='+item}`;

                                return(
                                    <li className={pg===item?'page-item active':'page-item'} key={item}>
                                        <Link href={`/shop${path}`}>
                                            <a className="page-link">
                                                {item}
                                            </a>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                        <li className={pg>1?'page-item':'d-none'}>
                            <Link href={`/shop${next}`}>
                                <a className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </Link>
                        </li>
                    </ul>
                </nav>)
            }


            <style jsx>
                {
                    `
                    .top-description-site{
                        padding:20px;
                       
                    }
                    
                    
                    
                    .top-description-site p{
                        font-size:1.2rem;
                    }
                    
                    .nav-link{
                    
                            color: #000;
                            text-decoration: none;
                            font-size: .95rem;
                            display: block;
                            letter-spacing: .075em;
                            padding:0px 5px 0px 10px;
                            
                            
                        }
                        
                        .nav-link:before{
                            content: attr(title);
                            display:block;
                            font-weight:bold;
                            height: 0;
                            overflow: hidden;
                            visibility: hidden;
                            
                        }
                        
                        .active{
                            font-weight:bold;
                        }
                        
                        .nav-link:hover{
                            font-weight:bold;
                        }
                        
                        .dropdown-toggle{
                            color:#263238;
                            text-decoration:none;
                        }
                        
                        .dropdown-toggle:hover{
                            font-weight:bold;
                        }
                        
                        .dropdown-item:hover{
                            font-weight:bold;
                        }
                        
                        .page-link{
                            box-shadow:none;
                            text-decoration:none;
                            color:#777;
                            font-weight:bold;
                            font-size: 1.2rem;
                            border:none;
                            bacground-color:transparent;
                        }
                        
                        .page-link:hover{
                            color:#000;
                            background-color:transparent;
                        }
                        
                        .pagination .active a{
                             background-color:transparent;
                             border:none;
                             color:#000;
                        }
                        
                       @media screen and (max-width: 991px) {
                            .dropdown{padding-top:10px;}
                        }
                         
                        
                  
                  `
                }
            </style>
        </MainLayout>
    )
}




export async function getServerSideProps(ctx){

    const {page, catid, tag} = ctx.query;
    let tagI = tag?`&tag=${tag}`:'';
    const response = await fetch(`${process.env.API_URL}/api/products?page=${page?page:1}&limit=28&${catid?'catid='+catid:'parentid=1'}${tagI}`)
        .catch(e=>e.message)

    if(!response.ok){
        return {
            props:{products:null, serverError: response.status}
        }
    }
    const post = await response.json()


    return {
        props:{products:post, serverError:null}
    }
}
