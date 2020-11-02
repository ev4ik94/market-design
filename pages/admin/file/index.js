import AdminLayout from "../../../components/admin/AdminLayout";
import {useCallback, useContext, useState, useEffect} from "react";
import {AuthContext} from "../../../context/auth.context";
import {useAuth} from "../../../hooks/auth.hook";
import useHttp from "../../../hooks/http.hook";
import {PreloaderComp} from "../../../components/Preloader";
import Link from 'next/link'

export default function File(){

    const {token} = useAuth()
    const {request, loading} = useHttp()
    const [files, setFiles] = useState(null)

    const fetchLinks = useCallback(async ()=>{

        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            await request(`${process.env.API_URL}/api/upload-file`, 'GET', null, {Authorization: `Bearer ${token}`}, signal)
                .then(result=>{
                    setFiles(result.data)
                })

            return function cleanup(){
                abortController.abort();
            }
        }catch(e){
            console.log(e.message)
        }
    }, [request, token]);

    useEffect(()=>{
        if(files===null && token!==null){
            fetchLinks()
        }
    }, [fetchLinks])


        if(!loading && files!==null){
            if(!files.length){
                return(
                    <AdminLayout>
                        <h2 className="text-center mt-5">File list is empty!</h2>
                        <div className="mt-5">
                            <Link href='/admin/file/create'>
                                <a className="btn btn-success">Add new File</a>
                            </Link>
                        </div>
                    </AdminLayout>
                )
            }

        }



    if(loading){
        return(<PreloaderComp />)
    }



    return(
        <AdminLayout>
            <h1>File List</h1>
            <div className="mt-5">
                <Link href='/admin/file/create'>
                    <a className="btn btn-success">Add new File</a>
                </Link>
            </div>
        </AdminLayout>
    )
}
