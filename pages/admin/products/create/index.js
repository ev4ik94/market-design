import {useState, useEffect, useContext, useRef} from 'react'
import AdminLayout from './../../../../components/admin/AdminLayout';
import useHttp from "../../../../hooks/http.hook";
import {AuthContext} from "../../../../context/auth.context";





export default function EditProduct() {

    return (
        <AdminLayout>
            <CreateComponent />
        </AdminLayout>
    )
}


function CreateComponent(){

    const [product, setProduct] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [publish, setPublish] = useState(false);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const {request} = useHttp();
    const {token} = useContext(AuthContext);


    const successAlert = useRef(null);


    const createProduct = async (e)=>{
        e.preventDefault();
        const body = {
            title,
            description,
            publish: publish?'true':'false'
        }


        await request(`${process.env.API_URL}/api/admin/products`, 'POST', body, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            setProduct(result.data)
            if(result.message){
                AlertSuccess(result.message)
            }
        }).catch(err=>{
            checkErrors(err.message)
        });
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

    if(product!==null){
        return <FormCreateSvt product={product} />
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
            <form>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                    />

                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="5"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-check pt-2">
                    <input className="form-check-input"
                           type="checkbox"
                           id="publish"
                           checked={publish}
                           onChange={(e)=>setPublish(e.target.checked)}/>
                    <label className="form-check-label" htmlFor="publish">
                        Publish
                    </label>
                </div>

                <button type="submit" className="btn btn-success mt-3" onClick={createProduct}>Save</button>
            </form>



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
                
            `
            }</style>
        </div>);
}


function FormCreateSvt({product}){

    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
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

    return (
        <div style={{padding:'40px 0px'}}>
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

            <Categories productId={product.id} checkErrors={checkErrors} AlertSuccess={AlertSuccess}/>

            <Cost productId={product.id} checkErrors={checkErrors} AlertSuccess={AlertSuccess}/>

            <Tags productId={product.id} checkErrors={checkErrors} AlertSuccess={AlertSuccess} />

            <Files productId={product.id} checkErrors={checkErrors} AlertSuccess={AlertSuccess} />


            <style jsx>
                {
                    `
                        .alert{
                            z-index:5;
                            width: 40%;
                            left: 45%;
                        }
                        
                        .alert button{
                            right: 10px;
                            top: 0;
                        }
                    `
                }
            </style>
        </div>
    )
}

function Categories({productId, AlertSuccess, checkErrors}){


    const [categories, setCategories] = useState([]);
    const {token} = useContext(AuthContext);
    const {request} = useHttp();
    const [selectCat, setSelect] = useState('');

    useEffect(()=>{
        if(productId!==null){
            if(!categories.length){
                getCategories();
            }
        }
    }, [productId])

    const getCategories = async ()=>{
        await request(`${process.env.API_URL}/api/category`,  'GET', null).then(result=>{
            console.log(result)
            setCategories(result.data);

        }).catch(err=>{
            checkErrors(err.message);
        });
    }

    const setCategory = async(catId)=>{

        const body ={
            category_id:catId+''
        };
        await request(`${process.env.API_URL}/api/admin/products/${productId}`,  'PUT', body, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            console.log(result)
            if(result.message){
                AlertSuccess(result.message)
            }

        }).catch(err=>{
            checkErrors(err.message);
        });

    }





    return(
        <div>

           <ul className={selectCat===''?'d-block list-cat pl-0':'d-none'}>
               <h3>Set the Category for the Product</h3>
               {
                   (categories || []).map(item=>{
                       return(
                           <li key={item.id}>
                               {item.title}
                               {item.children.length?(<ul>
                                   {
                                       item.children.map(itemCild=>{
                                           return(
                                               <li key={itemCild.id} onClick={(e)=>{
                                                   setCategory(itemCild.id);
                                                   setSelect(itemCild.title)
                                               }}>{itemCild.title}</li>
                                           )
                                       })
                                   }
                               </ul>):''}
                           </li>
                       )
                   })
               }
           </ul>
            <div className={selectCat!==''?'d-block':'d-none'}>
                <h3>Selected category</h3>
                <p className="font-weight-bold text-primary">{selectCat}</p>
                <button className="btn btn-danger" onClick={()=>{setSelect('')}}>Reset</button>
            </div>

            <style jsx>
                {
                    `
                        .list-cat li>ul li{
                            cursor:pointer;
                            transition:all .5s ease;
                        }
                        
                        .list-cat li>ul li:hover{
                            color:#20c997;
                        }
                    `
                }
            </style>
        </div>
    )
}


function Cost({productId, AlertSuccess, checkErrors}){


    const [personal, setPersonal] = useState({cost:''});
    const [commercial, setCommercial] = useState({cost:''});
    const [extendCommercial, setExtendCom] = useState({cost:''});
    //const [free, setFree] = useState({cost:''});

    const [personalDisc, setPersonalDisc] = useState(0);
    const [commercialDisc, setCommercialDisc] = useState(0);
    const [extendCommercialDisc, setExtendComDisc] = useState(0);
    const {token} = useContext(AuthContext);
    const {request} = useHttp();

    const [btnCheck, setCheck] = useState({
        Personal:false,
        Commercial:false,
        ExtendedCommercial:false,
        Free:false
    });

    const [savedCost, setSave] = useState({
        Personal:false,
        Commercial:false,
        ExtendedCommercial:false,
        Free:false
    });




    const createCost  =async (obj)=>{
        console.log(obj)

        await request(`${process.env.API_URL}/api/admin/products/cost/${productId}`, 'POST', obj, {
            Authorization: `Bearer ${token}`
        }).then(result=>{

            if(obj.type==='Extended Commercial'){
                setSave({...savedCost, ExtendedCommercial:true})
                setCheck({...btnCheck, ExtendedCommercial:false})
            }else{
                setSave({...savedCost, [obj.type]:true})
                setCheck({...btnCheck, [obj.type]:false})
            }


            //setCosts([...costs, result.data]);
            if(result.message){

                AlertSuccess(result.message)
            }
        }).catch(err=>{
            checkErrors(err.message)
        });
    }




    const discount = (disc, price)=>{
        if(disc>0) return price - (disc/100*price);
        return price;
    }

    const editCost = async(obj)=>{

        console.log(obj)

        await request(`${process.env.API_URL}/api/admin/products/cost/${productId}`, 'PUT', obj, {
            Authorization: `Bearer ${token}`
        }).then(result=>{

            if(obj.type==='Personal'){
                setPersonalDisc(obj.discount)
            }else if(obj.type==='Commercial'){
                setCommercialDisc(obj.discount)
            }else if(obj.type==='Extended Commercial'){
                setExtendComDisc(obj.discount);
            }

            if(result.message){
                AlertSuccess(result.message)
            }
        }).catch(err=>{
            checkErrors(err.message)
        });
    }



    return(
        <div className="wrap-forms-cost pt-5">
            <div className="create-cost-froms">
                <form className="col-9">

                    <div className="form-group cost-form">
                        <ul className="pl-0 pt-3">
                            <li>
                                <div className="container-inputs d-flex">

                                    <div className="form-group">

                                        <div className="cost-product d-flex">


                                                    <div className="form-check pt-2">
                                                        {
                                                            !savedCost.Personal?(
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="personal-cost"
                                                                    checked={btnCheck.Personal}
                                                                    onChange={(e)=>setCheck({...btnCheck, Personal: e.target.checked})}
                                                                />
                                                            ):''
                                                        }

                                                        <label className="form-check-label" htmlFor="personal-cost">
                                                            Personal
                                                        </label>
                                                    </div>


                                            <div className="form-cret-cost col-6 d-flex">
                                        <input

                                            type="text"
                                            className="form-control"
                                            readOnly={savedCost.Personal}
                                            value={personal.cost}
                                            name="Personal"
                                            onChange={e=>setPersonal({type:e.target.name, cost:e.target.value })}
                                        />
                                        <p className="mb-0 pt-2 pl-2">$</p>
                                            </div>
                                        </div>
                                        <div className="cost-discount d-flex mt-2">
                                            <label htmlFor="extentdCom-desc" className="pt-2 pr-2">Discount price</label>
                                            <input
                                                id="extentdCom-desc"
                                                type="text"
                                                readOnly={true}
                                                className="form-control col-5"
                                                value={personalDisc!==''?discount(personalDisc,personal.cost):''}

                                            />
                                            <p className="mb-0 pt-2 pl-2">{personalDisc}%</p>
                                        </div>
                                    </div>

                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            disabled={!btnCheck.Personal}
                                            onClick={()=>{
                                                createCost(personal);

                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            disabled={!savedCost.Personal}
                                            onClick={()=>{
                                                let discount = prompt('Enter value of discount in %');
                                                editCost({...personal, discount})
                                            }}
                                        >Discount</button>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="container-inputs d-flex">

                                    <div className="form-group">
                                        <div className="cost-product d-flex">

                                                    <div className="form-check pt-2">
                                                        {
                                                            !savedCost.Commercial?(
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="commercial-cost"
                                                            checked={btnCheck.Commercial}
                                                            onChange={(e)=>setCheck({...btnCheck, Commercial: e.target.checked})}
                                                        />
                                                            ):''
                                                        }
                                                        <label className="form-check-label" htmlFor="commercial-cost">
                                                            Commercial
                                                        </label>
                                                    </div>

                                            <div className="form-cret-cost col-6 d-flex">
                                            <input
                                                type="text"
                                                className="form-control"
                                                readOnly={savedCost.Commercial}
                                                value={commercial.cost}
                                                name="Commercial"
                                                onChange={e=>setCommercial({type:e.target.name, cost:e.target.value })}
                                            />
                                            <p className="mb-0 pt-2 pl-2">$</p>
                                            </div>
                                        </div>

                                        <div className="cost-discount d-flex mt-2">
                                            <label htmlFor="extentdCom-desc" className="pt-2 pr-2">Discount price</label>
                                            <input
                                                id="extentdCom-desc"
                                                type="text"
                                                readOnly={true}
                                                className="form-control col-5"
                                                value={commercialDisc!==''?discount(commercialDisc,commercial.cost):''}

                                            />
                                            <p className="mb-0 pt-2 pl-2">{commercialDisc}%</p>
                                        </div>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!btnCheck.Commercial}
                                        onClick={()=>{
                                            createCost(commercial);


                                        }}
                                    >
                                        Save
                                    </button>
                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            disabled={!savedCost.Commercial}
                                            onClick={()=>{
                                                let discount = prompt('Enter value of discount in %');
                                                editCost({...commercial, discount})
                                            }}
                                        >Discount</button>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="container-inputs d-flex">

                                    <div className="form-group">


                                            <div className="cost-product  d-flex">

                                                        <div className="form-check pt-2">
                                                            {
                                                                !savedCost.ExtendedCommercial?(
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="extended-cost"
                                                                checked={btnCheck.ExtendedCommercial}
                                                                onChange={(e)=>setCheck({...btnCheck, ExtendedCommercial: e.target.checked})}
                                                            />
                                                                ):''
                                                            }
                                                            <label className="form-check-label" htmlFor="extended-cost">
                                                                Extend. Commerc.
                                                            </label>
                                                        </div>

                                                <div className="form-cret-cost col-6 d-flex">
                                                    <input
                                                        type="text"
                                                        readOnly={savedCost.ExtendedCommercial}
                                                        className="form-control"
                                                        value={extendCommercial.cost}
                                                        name="Extended Commercial"
                                                        onChange={e=>setExtendCom({type:e.target.name, cost:e.target.value })}
                                                    />
                                                    <p className="mb-0 pt-2 pl-2">$</p>
                                                </div>
                                            </div>

                                            <div className="cost-discount d-flex mt-2">
                                                <label htmlFor="extentdCom-desc" className="pt-2 pr-2">Discount price</label>
                                                <input
                                                    id="extentdCom-desc"
                                                    type="text"
                                                    readOnly={true}
                                                    className="form-control col-5"
                                                    value={extendCommercialDisc!==''?discount(extendCommercialDisc,extendCommercial.cost):''}

                                                />
                                                <p className="mb-0 pt-2 pl-2">{extendCommercialDisc}%</p>
                                            </div>

                                    </div>
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!btnCheck.ExtendedCommercial}
                                        onClick={()=>{
                                            createCost(extendCommercial)


                                        }}
                                    >
                                        Save
                                    </button>

                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            disabled={!savedCost.ExtendedCommercial}
                                            onClick={()=>{
                                                let discount = prompt('Enter value of discount in %');
                                                editCost({...extendCommercial, discount})
                                            }}
                                        >Discount</button>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="container-inputs d-flex">
                                    {
                                        !savedCost.Free?(
                                            <div className="form-check pt-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="personal-cost"
                                                    checked={btnCheck.Free}
                                                    onChange={(e)=>setCheck({...btnCheck, Free: e.target.checked})}
                                                />
                                                <label className="form-check-label" htmlFor="personal-cost">
                                                    Free
                                                </label>
                                            </div>
                                        ):''
                                    }

                                    <button
                                        type="button"
                                        className="btn btn-success ml-2"
                                        disabled={!btnCheck.Free}
                                        onClick={()=>{
                                            createCost({type:'Free', cost:'0'})


                                        }}

                                    >
                                        Save
                                    </button>


                                </div>
                            </li>
                        </ul>
                    </div>


                </form>
            </div>
            <style jsx>{
                `
               .cost-form button{
                    height: 35px;
                    padding: 4px 10px;
                    font-size: .9rem;
               }
               
               .form-group ul li{
                    border-bottom:1px solid;
                    padding:10px 0px;
               }
                
             
               
                
            `
            }</style>
        </div>
    )
}

function Tags({productId, checkErrors}){

    const [formVisible, setFormVisible] = useState(false);
    const [tagName, setTagName] = useState('');
    const [tags, setTags] = useState([]);
    const {token} = useContext(AuthContext);
    const {request} = useHttp();
    const inputEl = useRef(null);
    const [allTags, setTagList] = useState(null);
    const selectionInp = useRef(null);
    const [selectValue, setValue] = useState('Choose...');

    useEffect(()=>{
        if(productId!==null){
            getTagList();

        }
    }, [productId]);

    const getTagList = async()=>{
        await request(`${process.env.API_URL}/api/admin/products/tag`,  'GET', null,{
            Authorization: `Bearer ${token}`
        }).then(result=>{

            setTagList(result.data);

        }).catch(err=>{
            checkErrors(err.message);
        });
    }

    const addTag = async ()=>{

        if(selectValue!=='Choose...'){

            const body = {title:selectValue};

            await request(`${process.env.API_URL}/api/admin/products/addTag/${productId}`, 'POST', body, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                for(let tag of allTags){
                    if(tag.title===selectValue){
                        console.log(tag)
                        setTags([...tags, tag]);
                    }
                }


            }).catch(err=>{
                checkErrors(err.message);

            });
        }else{
            checkErrors("You haven't chosen anything");
        }

    }

    const createTag = async (e)=>{
        e.preventDefault();

        const body = {title: tagName};

        await request(`${process.env.API_URL}/api/admin/products/tag/${productId}`, 'POST', body, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            setTags([...tags, result.data]);
            setFormVisible(false);
            setTagName('');

        }).catch(err=>{
            checkErrors(err.message);
            inputEl.current.classList.add('is-invalid');
        });
    }


    const deleteTag = async(slug)=>{
        await request(`${process.env.API_URL}/api/products/tags/${slug}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`
        }).then(async()=>{
            let newTags = [];
            for(let value of tags){
                if(value.title!==slug){
                    newTags.push(value)

                }
            }

            await setTags(newTags);
            console.log(tags)

        }).catch(err=>{
            checkErrors(err.message);
        });
    }

    return(
        <div className="pt-5">

            <h3>Tag list</h3>
            <div className="content-tags">
                <div className="create-tags">
                    <p className="text-success" onClick={()=>setFormVisible(true)}><span className="font-weight-bold">+</span> Create new tag</p>
                    <form className={`form-new-tag ${formVisible?'d-block':'d-none'}`}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Tag Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleInputEmail1"
                                ref={inputEl}
                                value={tagName}
                                onChange={e=>setTagName(e.target.value)}
                            />

                        </div>
                        <button type="submit" className="btn btn-success" onClick={createTag}>Create</button>
                    </form>
                </div>
                <form>
                    <div className="form-row align-items-center">
                        <div className="col-auto my-1">
                            <label className="mr-sm-2 sr-only" htmlFor="inlineFormCustomSelect">Tag List All</label>
                            <select
                                className="custom-select mr-sm-2"
                                id="inlineFormCustomSelect"
                                ref={selectionInp}
                                value={selectValue}
                                onChange={(e)=>setValue(e.target.value)}
                            >
                                <option value='Choose...'>Choose...</option>
                                {
                                    (allTags || []).map(item=>{

                                        return(
                                            <option
                                                key={item.id}
                                                value={item.title}
                                            >{item.title}</option>
                                        )
                                    })
                                }

                            </select>
                        </div>

                        <div className="col-auto my-1">
                            <button type="button" className="btn btn-primary" onClick={addTag}>Submit</button>
                        </div>
                    </div>
                </form>
                <ul className="pl-0 d-flex dlex-wrap pt-2" >
                    {
                        (tags||[]).map(item=>{

                            return(
                                <li key={item.id} className="item-tag position-relative">
                                    <span className="font-weight-bold text-danger position-absolute" onClick={()=>deleteTag(item.title)}>❌</span>
                                    <p className="mb-0">{item.title}</p>
                                </li>
                            )
                        })
                    }
                </ul>

                <style jsx>{
                    `
               .item-tag{
                    padding: 10px 10px 5px 10px;
                    margin: 3px;
                    background: #c7f2f9;
                    border-radius: 5px;
               }
               
               .item-tag span{
                    font-size:.6rem;
                    cursor:pointer;
                    top:2px;
                    right:5px;
               }
               
               .create-tags > p{
                    cursor:pointer;
               }
               
             
                
            `
                }</style>
            </div>
        </div>
    )
}

function Files({productId, AlertSuccess, checkErrors}){

    const {token} = useContext(AuthContext);
    const {request} = useHttp();
    const [images, setNewImage] = useState([]);
    const file = useRef(null);
    const [main, setMain] = useState(null);

    useEffect(()=>{

    }, [productId]);


    const deleteImage = async (id)=>{

        await request(`${process.env.API_URL}/api/admin/products/image/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            const arrImag = [];
            for(let value of images){

                if(value.id!==id){
                    arrImag.push(value);
                }
            }
            setNewImage(arrImag);
            if(result.message){
                AlertSuccess(result.message);
            }
        }).catch(err=>{
            checkErrors(err.message)
        });
    }




    const downLoadFile = async()=>{


        const form = new FormData();
        form.append('productImage', file.current.files[0]);


        let xhr = new XMLHttpRequest();

        xhr.open('POST', `${process.env.API_URL}/api/admin/products/image/${productId}`, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.onload = function() {

            setNewImage([...images, xhr.response.data]);

            if(xhr.response.message){
                AlertSuccess(xhr.response.message);
            }

        };
        xhr.onerror = function(err) {
            checkErrors(err.message)
        };
        xhr.send(form)


    }

    const updateMain = async(id)=>{
        setMain(id);

        await request(`${process.env.API_URL}/api/admin/products/imagemain/${id}/${productId}`,'PUT',null, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            console.log(result)
        }).catch(err=>{
            console.log(err.message)
        })

    }


    return(

        <div className="pt-5">
            <h3>Edit Files</h3>
            <div className="edit-images d-flex pt-4">
                <div className="downloadContainer col-5">
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlFile1" className="text-primary font-weight-bold">Download File</label>
                            <input type="file" className="form-control-file" id="exampleFormControlFile1" ref={file}/>
                        </div>
                    </form>

                    <button className="btn btn-primary" onClick={downLoadFile}>Download</button>
                </div>
                <div className="list-images col-7">
                    <ul className="pl-0 d-flex flex-wrap justify-content-start">
                        {
                            (images||[]).map(item=>{
                                console.log(main===item.id)
                                return(
                                    <li key={item.id} className="col-5">
                                        <div className="cont-image">
                                            <img src={item.small} alt="" className="img-cover"/>
                                        </div>
                                        <button
                                            className="btn btn-danger"
                                            onClick={()=>{deleteImage(item.id)}}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={main===item.id?true:false}
                                            onClick={()=>{updateMain(item.id)}}
                                        >
                                            Set Main
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>

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
