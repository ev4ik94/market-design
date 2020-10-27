import useHttp from '../../hooks/http.hook';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {PreloaderComp} from "../Preloader";

export default function Banner({banners:serverBanners}){

  const [banners, setBanners] = useState([]);
  const {request, loading} = useHttp();

  useEffect(()=>{
    if(!serverBanners) getBanners();
    else{
      setBanners(serverBanners.data);
    }

  },[serverBanners]);

  const getBanners = async()=>{
    await request(`${process.env.API_URL}/api/banners`, 'GET').then(result=>{
      setBanners(result.data);
    }).catch(err=>{
      console.log(err.message)
    })
  }

  if(loading){
      return(<PreloaderComp />)
  }

  return(
      <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {
            (banners || []).map((item, index)=>{
              return(
                  <div className={index===0?'carousel-item active':'carousel-item'} key={item.id}>
                      <img src={item.ImageBanner.large?item.ImageBanner.large:process.env.DEFAULT_IMAGE} className="d-block w-100 img-cover" alt={item.ImageBanner.large}/>
                      {
                          item.button?(
                              <div className="btn-banner position-absolute">
                                <Link href={item.button_url}>
                                    <a className="mx-auto d-block text-uppercase">{item.button_text}</a>
                                </Link>
                          </div>):''
                      }
                  </div>
              )

            })
          }
        </div>
        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>

          <style jsx>
              {
                  `
                    .carousel{
                        max-height:300px;
                        min-height:300px;
                        height:300px;
                        overflow:hidden;
                        width:100%;
                    }
                    
                    .carousel-inner, .carousel-item{
                        height:100%;
                    }
                    
                    .btn-banner{
                        top:40%;
                        left:0;
                        right:0;
                    }
                    
                    .btn-banner a{
                        padding:20px;
                        background-color:#f98e3c;
                        color:#fff;
                        text-decoration:none;
                        width:200px;
                        text-align:center;
                    }
                  `
              }
          </style>
      </div>
  )
}

export async function getServerSideProps(ctx){

  const response = await fetch(`${process.env.API_URL}/api/banners`)
  const obj = await response.json()


  return {
    props:{banners:obj}
  }
}
