import Link from "next/link";
import { useRouter } from 'next/router';



export default function NavUsers(){

    const router = useRouter();

    console.log()

    return(
        <ul className="pl-0 d-flex justify-content-between">
            <li className={`col-4 text-center ${router.pathname === '/user'?'active-link':''}`}>
                <Link href="/user">
                    <a className="text-uppercase" title="account details">account details</a>
                </Link>
            </li>
            <li className={`col-4 text-center ${router.pathname.indexOf('billing')>0?'active-link':''}`}>
                <Link href="/user/billing">
                    <a className="text-uppercase" title="billing details">billing details</a>
                </Link>
            </li>
            <li className={`col-4 text-center ${router.pathname.indexOf('history')>0?'active-link':''}`}>
                <Link href="/user/history">
                    <a className="text-uppercase" title="purchase history">purchase history</a>
                </Link>
            </li>

            <style jsx>
                {
                    `
                         ul > li{
                            border:1px solid #f2ede8;
                            border-left:none;
                            border-top:none;
                            padding:20px;
                         }
                         
                         .active-link > a{
                            font-weight:bold;
                         }
                         
                         ul > li > a{
                            color:#000;
                            text-decoration:none;
                            letter-spacing:.1rem;
                         }
                         
                         ul > li > a:hover{
                            font-weight:bold;
                          
                         }   
                         
                         ul > li > a:before{
                            content:attr(title);
                            font-weight:bold;
                            height:0;
                            overflow:hidden;
                            display:block;
                         }                     
                  
                  `
                }
            </style>
        </ul>
    )
}
