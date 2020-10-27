import {useState, useEffect, useContext, useCallback, useRef} from 'react'
import AdminLayout from './../../../../components/admin/AdminLayout';
import useHttp from "../../../../hooks/http.hook";
import {AuthContext} from "../../../../context/auth.context";
import {useRouter} from "next/router";




export default function CreateBanner() {

    return (
        <AdminLayout>
            <CreateComponentBan />
        </AdminLayout>
    )
}


function CreateComponentBan(){
    const [banner, setBanner] = useState(null);
    const [publish, setPublish] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [buttonPath, setButtonPath] = useState('');
    const [button, setButton] = useState(false);
    const [imageBanner, setImageBanner] = useState(process.env.DEFAULT_IMAGE);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const {request} = useHttp();
    const {token} = useContext(AuthContext);

    const successAlert = useRef(null);

    useEffect(()=>{

        if(banner===null){
            createBanner();
        }
    }, []);


    const createBanner = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            const body = {
                publish: 'false'
            }

            await request(`${process.env.API_URL}/api/admin/banners`, 'POST', body, {
                Authorization: `Bearer ${token}`
            }, signal).then(result=>{

                setBanner(result.data.banner)
                if(result.message){
                    AlertSuccess(result.message)
                }
            }).catch(err=>{
                checkErrors(err.message)
            });

            return function cleanup(){
                abortController.abort();
            }
        }catch(e){
            console.log(e.message)
        }
    }, [request, token]);



    const editBanner = async (e)=>{

        e.preventDefault();
        setButton(true);
        const body = {
            button:'true',
            button_text:buttonText,
            button_url: buttonPath,
            publish: publish?'true':'false'
        }

        console.log(banner.id)

        requestEdit(body);
    }

    const checkErrors = (message)=>{
        setError(true);
        setErrorMessage(message);
    }

    const AlertSuccess = (message)=>{
        setAlert(message);

        setTimeout(()=>{
            setAlert(false);
        }, 1500);
    }

    const setImage = (image)=>{
        if(image!==null){
            setImageBanner(image.large?image.large:imageBanner)
        }
    }

    const deleteButton = async(e)=>{
        e.preventDefault();
        setButton(false);
        setButtonText('');
        setButtonPath('');

        const body = {
            button:'false',
        }

        requestEdit(body);

    }

    const setPublishBann = (publishVal)=>{

        const body = {
            publish:publishVal?'true':'false'
        }

        requestEdit(body);
    }

    const requestEdit = async(body)=>{
        await request(`${process.env.API_URL}/api/admin/banners/${banner.id}`, 'PUT', body, {
            Authorization: `Bearer ${token}`
        }).catch(err=>{
            checkErrors(err.message)
        });
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

            <form>

                <div className="form-check pt-2">
                    <input className="form-check-input"
                           type="checkbox"
                           id="publish"
                           checked={publish}
                           onChange={(e)=> {
                               setPublish(e.target.checked)
                               setPublishBann(e.target.checked)
                           }}/>
                    <label className="form-check-label" htmlFor="publish">
                        Publish
                    </label>
                </div>

            </form>

            <div className="button-edit mt-5">
                {
                    button===null||button===false?(
                        <div>
                            <h3>Add Button</h3>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="buttonText">Button Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="buttonText"
                                        value={buttonText}
                                        onChange={(e)=>setButtonText(e.target.value)}
                                    />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="buttonPath">Button Path</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="buttonPath"
                                        value={buttonPath}
                                        onChange={(e)=>setButtonPath(e.target.value)}
                                    />
                                    <small id="buttonPath-help" className="form-text text-muted">Вставьте ссылку на страницу
                                        Пример: /shop/products/12
                                    </small>

                                </div>
                                <button type="submit" className="btn btn-primary" onClick={editBanner}>Submit</button>
                            </form>
                        </div>
                    ):(
                        <div>
                            <h3>Edit Button</h3>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="buttonText">Button Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="buttonText"
                                        value={buttonText}
                                        onChange={(e)=>setButtonText(e.target.value)}
                                    />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="buttonPath">Button Path</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="buttonPath"
                                        value={buttonPath}
                                        onChange={(e)=>setButtonPath(e.target.value)}
                                    />
                                    <small id="buttonPath-help" className="form-text text-muted">Вставьте ссылку на страницу
                                        Пример: {process.env.API_URL}/shop/products/12
                                    </small>

                                </div>
                                <button type="submit" className="btn btn-primary" onClick={editBanner}>Submit</button>
                            </form>
                            <button
                                className="btn btn-danger mt-3"
                                onClick={deleteButton}
                            >Delete Button</button>
                        </div>
                    )
                }
            </div>

            <Files banner={banner} AlertSuccess={AlertSuccess} checkErrors={checkErrors} setImage={setImage}/>



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



function Files({banner, AlertSuccess, checkErrors, setImage}){

    const {token} = useContext(AuthContext);
    const file = useRef(null);



    const downLoadFile = async()=>{


        try{
            const form = new FormData();
            form.append('bannerImage', file.current.files[0]);


            let xhr = new XMLHttpRequest();

            xhr.open('POST', `${process.env.API_URL}/api/admin/banners/image/${banner.id}`, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.onload = function() {

                if(xhr.status>300){
                    return checkErrors(xhr.response.message)
                }
                setImage(xhr.response.data)
                if(xhr.response.message){
                    AlertSuccess(xhr.response.message);
                }

            };
            xhr.onerror = function(err) {
                console.log(xhr.response)
                checkErrors(err.message)
            };
            xhr.send(form)
        }catch(err){
            checkErrors(err.message)
        }


    }


    return(

        <div className="pt-5">
            <h3>Edit Files</h3>
            <div className="edit-images d-flex pt-4">
                <div className="downloadContainer col-5 pl-0">
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlFile1" className="text-primary font-weight-bold">Download File</label>
                            <input type="file" className="form-control-file" id="exampleFormControlFile1" ref={file}/>
                        </div>
                    </form>

                    <button className="btn btn-primary" onClick={downLoadFile}>Download</button>
                </div>
                <div className="list-images col-7">

                </div>
            </div>

            <style jsx>{
                `
               .list-images .cont-image{
                   width: 100%;
                    height: 100px;
               }
               
               .list-images .btn-danger{
                    padding: 5px;
                    font-size: .9rem;
                    width: 100%;
                    margin: 10px 0px;
               }
               
             
                
            `
            }</style>
        </div>
    )


}

