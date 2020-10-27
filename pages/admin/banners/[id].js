import {useState, useEffect, useContext, useCallback, useRef} from 'react'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {useRouter} from "next/router";




export default function ViewBanner() {

    return (
        <AdminLayout>
            <ViewComponentBan />
        </AdminLayout>
    )
}


function ViewComponentBan(){

    const [banner, setBanner] = useState(null);
    const [publish, setPublish] = useState(false);
    const [buttonText, setButtonText] = useState(false);
    const [buttonPath, setButtonPath] = useState(false);
    const [button, setButton] = useState(false);
    const [imageBanner, setImageBanner] = useState(process.env.DEFAULT_IMAGE);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const {request} = useHttp();
    const {token} = useContext(AuthContext);
    const {query} = useRouter();

    const successAlert = useRef(null);

    const fetchLinks = useCallback(async ()=>{

        try{
            await request(`${process.env.API_URL}/api/admin/banners/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
                setPublish(result.data.publish)
                setBanner(result.data);
                setButton(result.data.button);
                setButtonText(result.data.button?result.data.button_text:'');
                setButtonPath(result.data.button?result.data.button_url:'');
                setImage(result.data.ImageBanner);
            }).catch(err=>{
                console.log(err.message)
            });


        }catch(e){
            console.log(e)
        }
    }, [request, token]);

    useEffect(()=>{
        if(banner===null){
            fetchLinks();
        }
    }, [fetchLinks]);




    /*const checkErrors = (message)=>{
        setError(true);
        setErrorMessage(message);
    }

    const AlertSuccess = (message)=>{
        setAlert(message);

        setTimeout(()=>{
            setAlert(false);
        }, 1500);
    }*/

    const setImage = (image)=>{
        if(image!==null){
            setImageBanner(image.large?image.large:imageBanner)
        }
    }


    return(
        <div className="wrap-main container">
            <div className={`alert alert-success position-fixed ${alert?'show':'fade'}`} role="alert" ref={successAlert}>
                {alert}
            </div>
            <div className={`alert alert-danger position-fixed ${error?'show':'fade'}`} role="alert">
                <strong className="text-center">Error!</strong>
                <br />
                {errorMessage}
                <button type="button" className="close position-absolute" onClick={()=>setError(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div className="banner-cont position-relative">
                <img src={imageBanner} alt="" className="img-cover"/>
                <button className={button?'d-block btn btn-banner':'d-none'}>
                    {buttonText?buttonText:''}
                </button>
            </div>

                <div className="form-check pt-2 pl-0">
                   <p>Publish {publish ? <span className="text-success mb-0">✔</span> :
                       <span className="text-danger mb-0">❌</span>}</p>
                </div>



            <style jsx>{
                `
               .cost-form button{
                    height: 35px;
                    padding: 4px 10px;
                    font-size: .9rem;
               }
               
               .alert-danger, .alert-success{
                    left: 45%;
                    padding: 20px 30px;
                    z-index: 5;
               }
               
               .close{ 
                    top: 5px;
                    right: 10px;
               }
               
               .banner-cont{
                    width: 100%;
                    height: 300px;
               }
               
               .btn-banner{
                    top: 50%;
                    left: 40%;
                    background-color:#f98e3c;
                    color:#fefefe;
                    border-radius:0px;
                    position:absolute;
                    padding: 10px 20px;
               }
                
            `
            }</style>
        </div>);
}



