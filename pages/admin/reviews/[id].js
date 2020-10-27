import {useState, useEffect, useContext, useCallback} from 'react'
import AdminLayout from './../../../components/admin/AdminLayout';
import useHttp from "../../../hooks/http.hook";
import {AuthContext} from "../../../context/auth.context";
import {useRouter} from "next/router";

export default function ReviewView() {

    return (
        <AdminLayout>
            <RenderReview />
        </AdminLayout>
    )
}

function RenderReview(){

    const [review, setReview] = useState(null);
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);
    const {query} = useRouter();

    const fetchLinks = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            await request(`${process.env.API_URL}/api/admin/review/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }, signal).then(result=>{

                setReview(result.data);

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




    if(loading){
        return(<p>Loading</p>)
    }

    return( <div className="wrap-main container">


       <h3>{review!==null&&review.name?review.name:''}</h3>
        <h4 className="font-weight-bold text-primary">{review!==null&&review.email?review.email:''}</h4>
        <div className="text-review">
            {review!==null&&review.text?review.text:''}
        </div>
        <style jsx>{
            `
               .text-review{
                    padding: 15px;
                    background: #c7f7ff;
                    border-radius: 10px;
               }
                
                
                
            `
        }</style>
    </div>);

}
