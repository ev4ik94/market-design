import Link from "next/link";
import { useRouter } from 'next/router';
import classes from '../../styles/components/navUser.module.css'



export default function NavUsers(){

    const router = useRouter();

    return(
        <ul className={`pl-0 d-flex justify-content-between ${classes['user-head-nav']}`}>
            <li className={`col-4 text-center ${router.pathname === '/user'?`${classes['active-link']}`:''}`}>
                <Link href="/user">
                    <a className="text-uppercase" title="account details">account details</a>
                </Link>
            </li>
            <li className={`col-4 text-center ${router.pathname.indexOf('billing')>0?`${classes['active-link']}`:''}`}>
                <Link href="/user/billing">
                    <a className="text-uppercase" title="billing details">billing details</a>
                </Link>
            </li>
            <li className={`col-4 text-center ${router.pathname.indexOf('history')>0?`${classes['active-link']}`:''}`}>
                <Link href="/user/history">
                    <a className="text-uppercase" title="purchase history">purchase history</a>
                </Link>
            </li>


        </ul>
    )
}
