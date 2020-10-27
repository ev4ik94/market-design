import Link from 'next/link';
import {useRouter} from "next/router";

export default function Navbar() {

    const router = useRouter();

    return (
        <>
            <div className="side-bar col-3 position-fixed">
                <div className="title-dash">
                    <h4 className="font-weight-bold text-center">Admin Panel</h4>
                </div>
                <ul className="nav flex-column">
                    <li className={router.pathname=='/admin'?'nav-item active':'nav-item'}>
                        <Link  href='/admin'>
                            <a className="nav-link ">Main</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/users'?'nav-item active':'nav-item'}>
                        <Link href='/admin/users'>
                            <a className="nav-link">Users</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/products'?'nav-item active':'nav-item'}>
                        <Link href='/admin/products'>
                            <a className="nav-link">Products</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/reviews'?'nav-item active':'nav-item'}>
                        <Link href='/admin/reviews'>
                            <a className="nav-link" href="#">Reviews</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/banners'?'nav-item active':'nav-item'}>
                        <Link href='/admin/banners'>
                            <a className="nav-link" href="#">Banners</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/file'?'nav-item active':'nav-item'}>
                        <Link href='/admin/file'>
                            <a className="nav-link" href="#">Files</a>
                        </Link>
                    </li>
                </ul>
            </div>

            <style jsx>{`
                .title-dash{
                    border-bottom: 1px solid white;
                
                }
                
                .nav .active{
                    border-bottom: 1px solid #17a2b8;
                    
                }

                .nav .active >a{
                    color: #17a2b8;
                }
                
                .side-bar{
                    top:0;
                    left:0;
                    padding:10px;
                    height:100%;
                    z-index:3;
                    background-color:#fff;
                    box-shadow: 1px 1px 5px rgba(0,0,0,.5);
                }
                
                .nav-item:hover{
                    font-weight:bold;
                }
                
                .nav{
                    padding: 10px;
                }
                
                .nav > li >a{color:#000;}
                
              
            `}</style>

        </>
    )
}
