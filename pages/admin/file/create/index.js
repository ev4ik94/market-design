import {useState, useEffect, useContext, useRef} from 'react'
import AdminLayout from './../../../../components/admin/AdminLayout';
import useHttp from "../../../../hooks/http.hook";
import {useAuth} from '../../../../hooks/auth.hook'



export default function AddFile(){

    const file = useRef(null);
    const {token, logout} = useAuth();
    const {request, loading} = useHttp()
    const resultSearch = useRef(null);
    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])
    const [selectProduct, setSelect] = useState(null)


    const fileUpload = ()=>{
        const form = new FormData();
        form.append('peelPic', file.current.files[0]);

        let xhr = new XMLHttpRequest();

        xhr.open('POST', `${process.env.API_URL}/api/upload-file/${selectProduct.id}`, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.onload = function() {

            if(xhr.status === 200){
                alert('File uploaded successfully')
            }else if(xhr.status === 401){
                logout()
            }else{
                alert('Error: '+xhr.response.message)
            }


        };
        xhr.onerror = function(err) {

        };
        xhr.send(form)
    }

    const searchProduct = async (value)=>{
        await fetch(`${process.env.API_URL}/api/search/${value.toLowerCase()}`)
            .then(result=>result.json())
            .then((result)=>{
                setResult(result.data)
            })
            .catch(err=>console.log(err.message))

    }

    return(
        <AdminLayout>
            <h1 className="text-center mt-3">Add New File</h1>

            <div>
                <h2>Select Product</h2>
                <div>
                    <div className="form-group position-relative">
                        <label htmlFor="SearchProducts" className="text-primary font-weight-bold">Enter Title Product</label>
                        <input
                            type="text"
                            className="form-control-file col-10"
                            id="SearchProducts"
                            value={search}
                            onChange={(e)=>{
                                setSearch(e.target.value)
                            }}
                        />
                        <button onClick={()=>searchProduct(search)} className="position-absolute btn-search btn-success">search</button>
                    </div>
                    <div className="p-1 col-10" ref={resultSearch}>
                        {
                            result.map(item=>{
                                return(
                                    <div key={item.id} className="d-flex p-1 item-result-srch" style={{borderBottom: '1px solid'}} onClick={()=>{
                                        setSelect(item)
                                        setResult([])

                                    }}>
                                        <div className="info-product col-8">
                                            <p className="mb-0" style={{paddingTop:'30px'}}>{item.title}</p>
                                        </div>
                                        <div className="icon-product col-3">
                                            {
                                                item.Images.map(img=>{
                                                    if(img.main){
                                                        return(
                                                            <img src={img.small} alt="" key={img.id}/>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        selectProduct && selectProduct!==null?(<><h3>Selected Product</h3><div className={'d-flex'}>
                            <div className="info-product col-8">
                                <p className="mb-0" style={{paddingTop:'30px'}}>{selectProduct.title}</p>
                            </div>
                            <div className="icon-product col-3">
                                {
                                    selectProduct.Images.map(img=>{
                                        if(img.main){
                                            return(
                                                <img src={img.small} alt="" key={img.id}/>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div></>):''
                    }
                </div>
            </div>

            <div className="col-5 mt-5">
                <form>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlFile1" className="text-primary font-weight-bold">Download File</label>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1" ref={file}/>
                    </div>
                </form>

                <button className="btn btn-primary" onClick={fileUpload}>Download</button>
            </div>

            <style>
                {
                    `
                        .btn-search{
                            top: 50%;
                            right: 5%;
                            
                        }
                        
                        .item-result-srch{
                            cursor: pointer;
                            transition: all .4s ease;
                        }
                        
                        .item-result-srch:hover{
                            background-color: rgba(0,0,0,.05)
                        }
                    `
                }
            </style>
        </AdminLayout>
    )
}
