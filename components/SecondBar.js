import {useRouter} from "next/router";
import Link from "next/link";
import {useState} from 'react';



export default function SecondBar({categories}){

    const router = useRouter();
    const [search,setSearch] = useState('');

    const searchSubmit = async (e)=>{
        e.preventDefault()
        router.push(`/shop?s=${search.toLowerCase().replace(' ', '-')}`);
    }


    return(
        <nav className="navbar navbar-expand-lg  bg-white container">
            <ul className="navbar-nav mr-auto flex-row flex-wrap justify-content-lg-around justify-content-md-around col-9">
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
            <form className="form-inline my-2 my-lg-0 flex-nowrap col-md-12 col-lg-3 position-relative" >
                <input
                    className="form-control mr-sm-2 w-100"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <button className="btn my-2 my-sm-0 position-absolute" type="submit" onClick={searchSubmit}>
                    <img src="/icons/magnifying-glass.svg" className="img-contain" alt=""/>
                </button>
            </form>

            <style jsx>
                {
                    `
                        .navbar{
                            border-bottom: 1px solid #f2ede8;
                            padding: 1rem;
                        }
                        
                        .nav-link{
                            color: #000;
                            text-decoration: none;
                            font-size: 1rem;
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
                            right:10%;
                            
                        }
                        
                        .form-inline button:hover{
                            background:transparent;
                        }
                        
                        .form-inline input{
                            border:1px solid #989898!important;
                            outline: none;
                            box-shadow: none;
                            border-radius:0;
                            height: 50px;
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
