import {useState, useEffect, useContext, useRef} from 'react'
import AdminLayout from './../../../../components/admin/AdminLayout';
import useHttp from "../../../../hooks/http.hook";
import {useAuth} from '../../../../hooks/auth.hook'



export default function AddFile(){

    const file = useRef(null);
    const {token} = useAuth();

    const fileUpload = ()=>{
        const form = new FormData();
        form.append('peelPic', file.current.files[0]);


        let xhr = new XMLHttpRequest();

        xhr.open('POST', `${process.env.API_URL}/api/upload-file/1`, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.onload = function() {

            //setNewImage([...images, xhr.response.data]);

            /*if(xhr.response.message){
                //AlertSuccess(xhr.response.message);
            }*/

            console.log(xhr.response)

        };
        xhr.onerror = function(err) {
            //checkErrors(err.message)
        };
        xhr.send(form)
    }
    return(
        <AdminLayout>
            <h1>Add File</h1>

            <div className="col-5">
                <form>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlFile1" className="text-primary font-weight-bold">Download File</label>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1" ref={file}/>
                    </div>
                </form>

                <button className="btn btn-primary" onClick={fileUpload}>Download</button>
            </div>
        </AdminLayout>
    )
}
