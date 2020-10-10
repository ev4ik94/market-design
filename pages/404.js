import Link from "next/link";


export default function NotFound(){
    return(
        <div className="container pt-5">
            <div className="pic-logo col-6 mx-auto pb-3 mt-5">
                <img src="/vercel.svg" alt=""/>
            </div>
            <p className="text-center font-weight-bold mt-3 text-uppercase">
                <span>404</span><br/>
                Page not found!
            </p>
            <div className="link-home text-center"><Link href="/"><a>Home</a></Link></div>

            <style jsx>{`
                .pic-logo{
                    border-bottom:1px solid;
                }
                
                p>span{font-size:4rem;}
                
                p{font-size:2rem; color:#000;}
                
                a{
                    border: 1px solid;
                    padding: 10px 30px;
                    color: #000;
                    transition:all .4s ease;
                    text-decoration:none;
                    display:inline-block;
                }
                
                a:hover{
                    background-color:#000;
                    color:#fff;
                }
            `}</style>
        </div>
    )
}
