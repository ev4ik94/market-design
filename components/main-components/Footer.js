import Link from "next/link";
import React from "react";

export function Footer() {
    return(
        <div className="container-fluid">
            <div className="footer-nav-links d-flex flex-lg-row flex-md-row flex-column">
                <div className="brand-icon col-12 col-lg-3 col-md-3 mb-5">
                    <div className="cont-img" style={{width:'150px'}}>
                        <img src="/icons/peelpic.svg" alt=""/>
                    </div>
                </div>
                <div className="links-foot col-12 col-lg-9 col-md-9 d-flex">
                    <div className="site-links col-lg-6 col-sm-4">
                        <ul className="pl-0">
                            <li>
                                <Link href="/company">
                                    <a className="nav-link text-uppercase" title="about company">
                                        about company
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/company">
                                    <a className="nav-link text-uppercase" title="privacy policy">
                                        privacy policy
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/company">
                                    <a className="nav-link text-uppercase" title="terms of services">
                                        terms of services
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/company">
                                    <a className="nav-link text-uppercase" title="licenses">
                                        licenses
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/company">
                                    <a className="nav-link text-uppercase" title="payments">
                                        payments
                                    </a>
                                </Link>
                            </li>

                        </ul>
                    </div>
                    <div className="social-links col-lg-6 col-sm-4">
                        <ul className="pl-0">
                            <li>
                                <p className="font-weight-bold text-uppercase mb-0" style={{padding:'.5rem 1rem'}}>social</p>
                            </li>
                            <li>

                                <a href="#" className="nav-link text-uppercase" title="instagram">
                                    instagram
                                </a>

                            </li>
                            <li>
                                <a href="#" className="nav-link text-uppercase" title="facebook">
                                    facebook
                                </a>
                            </li>


                        </ul>
                    </div>
                </div>
            </div>
            <div className="bottom-foot">
                <ul className="pl-0 d-flex justify-content-center">
                    <li><img src="/icons/visa.svg" alt=""/></li>
                    <li><img src="/icons/mastercard.svg" alt=""/></li>
                </ul>
            </div>

            <style jsx>{
                `
                
                    .container-fluid{
                        padding-top: 20px;
                        border-top: 1px solid #f2ede8;
                        margin-top: 100px;
                    }
                    
                    
                    .nav-link{font-size:.9rem;}
                    
                    .site-links .nav-link{color:#000;}
                    
                    .social-links .nav-link{color:#8e8e8e;}
                    
                    .nav-link:hover{font-weight:bold;}
                    
                    .nav-link:before{
                        content:arr(title);
                        font-weight:bold;
                        height:0;
                        display:block;
                        overflow:hidden;
                    }
                    
                    .bottom-foot li{
                        width:50px;
                        margin:10px;
                    }
                    
                    @media screen and (max-width: 767px) {
                        .site-links,.site-links .nav-link {padding-left:0;}
                        
                        .nav-link,p{font-size:.8rem;}
                        
                        
                    }
                    
                    @media screen and (max-width: 400px) {
                      
                        .nav-link,p{
                            font-size:.65rem;
                        }
                        
                         
                    }
                
                `
            }</style>
        </div>
    )
}
