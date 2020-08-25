import Head from 'next/head'
import {useState, useEffect} from 'react'
import Link from 'next/link';
import {useRouter} from "next/router";

export default function Navbar() {

    const router = useRouter();

    return (
        <>
            <div className="side-bar bg-info col-3 position-fixed">
                <div className="title-dash">
                    <h4 className="font-weight-bold text-white text-center">Admin Panel</h4>
                </div>
                <ul className="nav flex-column">
                    <li className={router.pathname=='/admin'?'nav-item active':'nav-item'}>
                        <Link  href='/admin'>
                            <a className="nav-link  text-white">Главная</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/users'?'nav-item active':'nav-item'}>
                        <Link href='/admin/users'>
                            <a className="nav-link  text-white">Пользователи</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/shop-products'?'nav-item active':'nav-item'}>
                        <Link href='/admin/products'>
                            <a className="nav-link text-white">Товары</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/reviews'?'nav-item active':'nav-item'}>
                        <Link href='/admin/reviews'>
                            <a className="nav-link text-white" href="#">Отзывы</a>
                        </Link>
                    </li>
                    <li className={router.pathname=='/admin/banners'?'nav-item active':'nav-item'}>
                        <Link href='/admin/banners'>
                            <a className="nav-link text-white" href="#">Баннеры</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href='/admin/products'>
                            <a className="nav-link text-white" href="#">Файлы</a>
                        </Link>
                    </li>
                </ul>
            </div>

            <style jsx>{`
                .title-dash{
                    border-bottom: 1px solid white;
                
                }
                
                .nav .active{
                    background: rgba(251,251,251,.2);
                    border-radius: 5px;
                }
                
                .side-bar{
                    top:0;
                    left:0;
                    padding:10px;
                    height:100%;
                }
                
                .nav-item:hover{
                    background: rgba(251,251,251,.2);
                    border-radius: 5px;
                    transition:all .6s ease;
                }
                
                .nav{
                    padding: 10px;
                }
                
              
            `}</style>

        </>
    )
}
