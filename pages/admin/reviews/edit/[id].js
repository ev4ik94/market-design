import {useState, useEffect, useContext, useCallback, useRef} from 'react'
import AdminLayout from './../../../../components/admin/AdminLayout';
import useHttp from "../../../../hooks/http.hook";
import {AuthContext} from "../../../../context/auth.context";
import {useRouter} from "next/router";

export default function EditReview() {

    return (
        <AdminLayout>
            <RenderEdit />
        </AdminLayout>
    )
}

function RenderEdit(){

    const [review, setReview] = useState(null);
    const [textReview, setText] = useState('');
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const {query} = useRouter();
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const successAlert = useRef(null);

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

    const fetchLinks = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            await request(`${process.env.API_URL}/api/admin/review/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }, signal).then(result=>{

                setReview(result.data);
                setText(result.data.text && result.data.text!==null?result.data.text:'');

            });

            return function cleanup(){
                abortController.abort();
            }
        }catch(e){
            console.log(e.message)
        }
    }, [request, token]);

    useEffect(()=>{
        if(review===null){
            fetchLinks();
        }
    }, [fetchLinks]);



    const editReview = async (e)=>{

        e.preventDefault();

        const data = {text: textReview};

        await request(`${process.env.API_URL}/api/admin/review/${query.id}`, 'PUT', data, {
            Authorization: `Bearer ${token}`
        }).then(result=>{

            if(result.message){
                AlertSuccess(result.message)
            }

        }).catch(err=>{
            checkErrors(err.message)
        })

    }


    if(loading){
        return(<p>Loading</p>)
    }

    return( <div className="wrap-main container">

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

        <h3>{review!==null&&review.name?review.name:''}</h3>
        <h4 className="font-weight-bold text-primary">{review!==null&&review.email?review.email:''}</h4>
        <form>
            <div className="form-group">

                <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="5"
                    value={textReview}
                    onChange={(e)=>setText(e.target.value)}
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" onClick={editReview}>Edit</button>
        </form>
        <style jsx>{
            `
               .text-review{
                    padding: 15px;
                    background: #c7f7ff;
                    border-radius: 10px;
               }
               
               .alert{
                    left: 45%;
                    width:30%;
                    padding: 20px 30px;
                    z-index: 5;
               }
               
                .close{ 
                    top: 5px;
                    right: 10px;
               }
                
                
                
            `
        }</style>
    </div>);

}
