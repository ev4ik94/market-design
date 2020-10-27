import {useState, useEffect} from 'react'
import MainLayout from '../components/MainLayout';
import useHttp from '../hooks/http.hook';
import Link from "next/link";
import ProdPortfolio from "../components/ProdPortfolio";
import {useRouter} from "next/router";
import {decrypt, getCookie} from "../components/secondary-functions";
import {Preloader} from "../components/Preloader";
import Error from "../components/Error";

export default function Portfolio({products:serverProd, serverError}) {

    const [productsPortfolio, setProducts] = useState([]);
    const {request, error, loading} = useHttp();
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    const [pagination, setPagination] = useState([]);

    const {catid} = router.query;

    const fun = (pagination) => {
        let a = pagination.filter((item,index) => index !==0);
        setPagination(a);
    }
    useEffect(()=>{

        if(!serverProd) getProducts();
        else{

           if(serverError===null){
               setProducts(serverProd.data&&serverProd.data.rows?serverProd.data.rows:[]);
               const a = (serverProd.data&&serverProd.data.count?serverProd.data.count:0)/30;
               let arrPag = [];
               for(let i=0; i<=a; i++){
                   arrPag.push(i+1)
               }
               setPagination(arrPag);
               fun(arrPag)
           }


        }
    }, [catid]);

    useEffect(()=>{

        if(!categories.length){
            let categories = decrypt(getCookie('categories')?getCookie('categories'):'').filter(item=>item.title===router.pathname.replace('/',''));
            setCategories(categories.length&&categories[0].children?categories[0].children:[]);
        }
    }, [categories]);

    useEffect(()=>{

        if(serverError!==null){
            if(serverError===404){
                return window.location.href = `${process.env.API_URL}/404`
            }
        }

    }, [serverError])



    const getProducts = async()=>{


            await request(`${process.env.API_URL}/api/products?page=${pagination!==null&&pagination.length?pagination[0]:1}&limit=30&${catid ? 'catid=' + catid : 'parentid=3'}&recent=1`).then(result => {

                let arr = productsPortfolio;
                if(result.data&&result.data.rows){
                    for(let value of result.data.rows){
                        arr.push(value);
                    }
                }
                setProducts(arr);
                fun(pagination)
            })



    }


    const loadMoreProducts = async(e)=>{
        e.preventDefault();
        getProducts();
    }

    if(loading){
        return(<Preloader />)
    }



    if(error!==null || serverError!==null){
        return(<Error />)
    }


    return (
        <MainLayout title={'Title'}>
            <h2 className="text-center text-uppercase font-weight-bold mt-5">portfolio</h2>
            <div style={{padding:'35px 25px 10px'}} className="mb-3">
                <p className="text-uppercase d-flex mb-0">you are here: <Link href="/">
                    <a className="nav-link">home</a>
                </Link> / portfolio</p>
            </div>
            <NavBar categories={categories} />
            <div className="container-fluid mt-5">
                <ProdPortfolio products={productsPortfolio}/>

                {
                    pagination!==null&&pagination.length?(<a href="#"
                                          className="text-uppercase btn-more d-block text-center mx-auto"
                                          onClick={loadMoreProducts}
                                        >
                                        see more
                                        </a>
                    ):''
                }

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
                            outline:none;
                            
                        }
                        
                        .btn-more:hover{
                            background-color:#000;
                            color:#fff;
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
                  
                  `
                }
            </style>
        </MainLayout>
    )
}

function NavBar({categories}){

    const router = useRouter();



    return(
        <nav className="navbar navbar-expand-lg  bg-light">
            <ul className="navbar-nav flex-row flex-wrap mx-auto">
                <li className="nav-item text-uppercase">
                    <Link href="/portfolio">
                        <a className={!router.query.catid?'nav-link active':'nav-link'}>all works</a>
                    </Link>
                </li>
                {
                    (categories || []).map(item=>{
                        let path = `/portfolio?catid=${item.id}`;

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
    const response = await fetch(`${process.env.API_URL}/api/products?page=${page?page:1}&limit=30&${catid?'catid='+catid:'parentid=3'}&recent=1`)
        .catch(e=>e.message);

    if(!response.ok){

        return{
            props:{products:null, serverError:response.status}
        }
    }else{
        const post = await response.json();

        return {
            props:{products:post, serverError:null}
        }
    }

}
