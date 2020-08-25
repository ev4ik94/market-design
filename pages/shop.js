import Head from 'next/head'
import {useState, useEffect} from 'react'
import MainLayout from '../components/MainLayout';
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import {getCookie, decrypt, paginationCalc} from "../components/secondary-functions";
import ProdShop from "../components/ProdShop";
import { useRouter } from 'next/router';

export default function Shop({products:serverProduct}) {

    const router = useRouter()
    const {request, loading} = useHttp();
    const [productsGet, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dropdown, setDropdown] = useState('default');
    const [pagination, setPagintaion] = useState([]);
    const {catid,page} = router.query;

    useEffect(()=>{
        setDropdown('default')
        if(!serverProduct) getProducts();
        else{
            setProducts(serverProduct.data&&serverProduct.data.rows?serverProduct.data.rows:[]);
            paginationCalc(serverProduct.data&&serverProduct.data.count?serverProduct.data.count:0, 27,setPagintaion);
        }
    }, [catid]);



    useEffect(()=>{
        if(!categories.length){
            let categories = decrypt(getCookie('categories')?getCookie('categories'):'').filter(item=>item.title===router.pathname.replace('/',''));
            setCategories(categories.length&&categories[0].children?categories[0].children:[]);
        }
    }, [categories]);



    const getProducts = async(recent=false,popular=false)=>{


        await request(`${process.env.API_URL}/api/products?page=${page?page:1}&limit=28&${catid?'catid='+catid:'parentid=1'}${recent?'&recent=1':'&recent=0'}${popular?'&popular=1':'&popular=0'}`).then(result=>{
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



    return (
        <MainLayout title={'Title'}>

            <NavBar categories={categories} />

            <div style={{padding:'35px 25px 10px'}} className="mb-3">
                <p className="text-uppercase d-flex mb-0">you are here: <Link href="/">
                    <a className="nav-link">home</a>
                </Link> / shop</p>
                <div className="dropdown d-flex justify-content-end">
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
            </div>

            <ProdShop products={productsGet}/>

            <nav aria-label="Page navigation example">
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
            </nav>


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
                        }
                        
                        .page-link:hover{
                            color:#000;
                        }
                        
                        .pagination .active a{
                             background-color:transparent;
                             border:none;
                             color:#000;
                        }
                        
                       
                         
                        
                  
                  `
                }
            </style>
        </MainLayout>
    )
}


function NavBar({categories}){

    const router = useRouter();
    const [search,setSearch] = useState('');


    const searchSubmit = (e)=>{
        e.preventDefault()
    }

    return(
        <nav className="navbar navbar-expand-lg  bg-light">
            <ul className="navbar-nav mr-auto flex-row flex-wrap">
                <li className="nav-item text-uppercase">
                    <Link href="/shop">
                        <a className={!router.query.catid?'nav-link active':'nav-link'}>all products</a>
                    </Link>
                </li>
                {
                    (categories || []).map(item=>{
                        let path = `/shop?catid=${item.id}`;

                        return(
                            <li className="nav-item text-uppercase" key={item.id}>
                                <Link href={path}>
                                    <a className={router.query.catid===(item.id+'')?'nav-link active':'nav-link'}>{item.slug}</a>
                                </Link>
                            </li>
                        )
                    })
                }

            </ul>
            <form className="form-inline my-2 my-lg-0 flex-nowrap col-md-12 col-lg-3" >
                <input
                    className="form-control mr-sm-2 w-100"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <button className="btn my-2 my-sm-0" type="submit" onClick={searchSubmit}>
                    <img src="/icons/magnifying-glass.svg" className="img-contain" alt=""/>
                </button>
            </form>

            <style jsx>
                {
                    `
                    
                        
                        .nav-link{
                            color: #000;
                            text-decoration: none;
                            font-size: .95rem;
                            display: block;
                            letter-spacing: .075em;
                            padding: .5rem 1rem;
                            
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
                        
                        .form-inline button{
                            width: 40px;
                            height: 40px;
                            border: none;
                            padding: 10px;
                            outline:none;
                            box-shadow:none;
                        }
                        
                        .form-inline button:hover{
                            background:transparent;
                        }
                        
                        .form-inline input{
                            border:1px solid transparent!important;
                            outline: none;
                            box-shadow: none;
                            border-radius:0;
                        }
                        .form-inline input:focus {
                            border:1px solid #000!important;
                        }
                        
                                            
                        
                        .form-inline input:hover{
                            border:1px solid #000!important;
                            cursor:pointer;
                        }
                        
                        ::placeholder { 
                            color: #989898;
                            opacity: 1; 
                           }

                        :-ms-input-placeholder { 
                            color: #989898;
                            }

                        ::-ms-input-placeholder { 
                            color: #989898;
                        }
                    
                    `
                }
            </style>
        </nav>
    )
}

export async function getServerSideProps(ctx){

    const {page, catid} = ctx.query;
    const response = await fetch(`${process.env.API_URL}/api/products?page=${page?page:1}&limit=28&${catid?'catid='+catid:'parentid=1'}`)
    const post = await response.json()


    return {
        props:{products:post}
    }
}