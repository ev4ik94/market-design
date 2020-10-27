import {useState, useEffect, useContext, useCallback, useRef} from 'react'
import AdminLayout from './../../../../components/admin/AdminLayout';
import useHttp from "../../../../hooks/http.hook";
import {AuthContext} from "../../../../context/auth.context";
import {useRouter} from "next/router";
import {PreloaderComp} from './../../../../components/Preloader';




export default function EditProduct() {

    return (
        <AdminLayout>
            <EditComponent />
        </AdminLayout>
    )
}


function EditComponent(){

    const [product, setProduct] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [publish, setPublish] = useState(false);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const {request} = useHttp();
    const {token} = useContext(AuthContext);
    const {query} = useRouter();

    const successAlert = useRef(null);

    const fetchLinks = useCallback(async ()=>{

        try{
            await request(`${process.env.API_URL}/api/admin/products/${query.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then(result=>{
                setProduct(result.data);
            }).catch(err=>{
                checkErrors(err.message)
            });


        }catch(e){
            console.log(e)
        }
    }, [request, token]);

    useEffect(()=>{
        if(product===null){
            fetchLinks();
        }
    }, [fetchLinks]);


    useEffect(()=>{
        if(product!==null){
            setTitle(product.title!==null?product.title:'');
            setDescription(product.description!==null?product.description:'');
            setPublish(product.publish)
        }
    }, [product]);

    const editProduct = async (e)=>{
        e.preventDefault();
        const body = {
            title,
            description,
            publish: publish?'true':'false'
        }


         await request(`${process.env.API_URL}/api/admin/products/${query.id}`, 'PUT', body, {
             Authorization: `Bearer ${token}`
         }).then(result=>{
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

                <button type="submit" className="btn btn-success mt-3" onClick={editProduct}>Save</button>
            </form>

            <Categories product={product} AlertSuccess={AlertSuccess} checkErrors={checkErrors} />

            <Cost product={product} AlertSuccess={AlertSuccess} checkErrors={checkErrors}/>

            <TagList product={product!==null&&product.tags?product:null} checkErrors={checkErrors}/>

            <Files product={product} AlertSuccess={AlertSuccess} checkErrors={checkErrors} />

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
                    width:30%;
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


function Cost({product, AlertSuccess, checkErrors}){

    const [costs, setCosts] = useState(null);

    const [personal, setPersonal] = useState('');
    const [commercial, setCommercial] = useState('');
    const [extendCommercial, setExtendCom] = useState('');
    const [free, setFree] = useState('');

    const [personalDisc, setPersonalDisc] = useState(0);
    const [commercialDisc, setCommercialDisc] = useState(0);
    const [extendCommercialDisc, setExtendComDisc] = useState(0);


    const [crtCost, setCrtCost] = useState({
        Personal:'',
        Commercial:'',
        ExtendedCommercial:'',
        Free:''
    });
    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();

    const [btnCheck, setCheck] = useState({
        Personal:false,
        Commercial:false,
        ExtendedCommercial:false,
        Free:false
    });

    useEffect(()=>{

        if(product!==null && costs===null){
            setCosts(product.costs);
        }

    }, [product])

    useEffect(()=>{

        if(costs!==null && costs.length){
            for(let i of costs){
                switch(i.type){
                    case 'Personal':
                        setPersonal(i.cost);
                        setPersonalDisc(i.discount!==null?i.discount:0)
                        break;
                    case 'Commercial':
                        setCommercial(i.cost)
                        setCommercialDisc(i.discount!==null?i.discount:0)
                        break;
                    case 'Extended Commercial':
                        setExtendCom(i.cost)
                        setExtendComDisc(i.discount!==null?i.discount:0)
                        break;
                    case 'Free':
                        setFree(i.cost)

                        break;
                    default:
                        break;
                }

            }
        }

    }, [costs]);







    const editCost  =async (obj)=>{


        await request(`${process.env.API_URL}/api/admin/products/cost/${product.id}`, 'PUT', obj, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            if(result.message){
                AlertSuccess(result.message)
            }
        }).catch(err=>{
            checkErrors(err.message)
        });
    }

    const createCost  =async (obj)=>{


        await request(`${process.env.API_URL}/api/admin/products/cost/${product.id}`, 'POST', obj, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            setCosts([...costs, result.data]);
            if(result.message){

                AlertSuccess(result.message)
            }
        }).catch(err=>{
            checkErrors(err.message)
        });
    }

    const deleteCost  =async (obj)=>{


        await request(`${process.env.API_URL}/api/admin/products/cost/${product.id}`, 'DELETE', obj, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            switch(obj.type){
                case 'Personal':
                    setPersonal('');
                    break;
                case 'Commercial':
                    setCommercial('')
                    break;
                case 'Extended Commercial':
                    setExtendCom('')

                    break;
                case 'Free':
                    setFree('')

                    break;
                default:
                    break;
            }
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

    if(loading){
        return(<PreloaderComp />)
    }



    return(
        <div className="wrap-forms-cost d-flex justify-content-between pt-5">
            <div className="edit-cost-forms col-6 pl-0">
                <form>

                    <div className="form-group cost-form">
                        <h3>Edit Cost</h3>
                        <ul className="pl-0 pt-3">
                            <li className={`${personal.length?'d-block':'d-none'}`}>
                                <div className="container-inputs d-flex">

                                    <div className="form-group col-7 pl-0">
                                        <div className="current-cost d-flex">
                                            <label htmlFor="personal-cost" className="pt-2 pr-2">Personal</label>
                                            <input
                                                id="personal-cost"
                                                type="text"
                                                className="form-control col-4"
                                                value={personal}
                                                name="Personal"
                                                onChange={e=>setPersonal(e.target.value)}
                                            />
                                            <p className="mb-0 pt-2 pl-2">$</p>
                                        </div>
                                        <div className="cost-discount d-flex">
                                            <label htmlFor="personal-desc" className="pt-2 pr-2">Disc. price</label>
                                            <input
                                                id="personal-desc"
                                                type="text"
                                                readOnly={true}
                                                className="form-control col-4"
                                                value={discount(personalDisc,personal)}

                                            />
                                            <p className="mb-0 pt-2 pl-2">{personalDisc}%</p>
                                        </div>
                                    </div>
                                    <div className="btn-group flex-wrap" role="group" aria-label="Basic example">
                                        <button type="button"
                                                className="btn btn-primary"
                                                onClick={()=>{
                                                    editCost({type:'Personal',cost:personal})
                                                }}
                                        >
                                            edit
                                        </button>
                                        <button type="button"
                                                className="btn btn-info"
                                                onClick={()=>{
                                                    let discount = prompt('Enter value discount in %') || '';
                                                    setPersonalDisc(discount);
                                                    editCost({type:'Personal',discount})

                                                }}
                                        >discount
                                        </button>
                                        <button type="button"
                                                className="btn btn-danger col-12"
                                                onClick={()=>{deleteCost({type:'Personal'})}}
                                        >delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                            <li className={`${commercial.length?'d-block':'d-none'}`}>
                                <div className="container-inputs d-flex">

                                    <div className="form-group col-7 pl-0">
                                        <div className="current-cost d-flex">
                                            <label htmlFor="commercial-cost" className="pt-2 pr-2">Commercial</label>
                                            <input
                                                id="commercial-cost"
                                                type="text"
                                                className="form-control"
                                                value={commercial}
                                                name="Commercial"
                                                onChange={e=>setCommercial(e.target.value)}
                                            />
                                            <p className="mb-0 pt-2 pl-2">$</p>
                                        </div>

                                        <div className="cost-discount d-flex">
                                            <label htmlFor="personal-desc" className="pt-2 pr-2">Disc. price</label>
                                            <input
                                                id="personal-desc"
                                                type="text"
                                                readOnly={true}
                                                className="form-control col-4"
                                                value={discount(commercialDisc,commercial)}

                                            />
                                            <p className="mb-0 pt-2 pl-2">{commercialDisc}%</p>
                                        </div>
                                    </div>

                                    <div className="btn-group flex-wrap" role="group" aria-label="Basic example">
                                        <button type="button"
                                                className="btn btn-primary"
                                                onClick={()=>{
                                                    editCost({type:'Commercial',cost:commercial})
                                                }}
                                        >
                                            edit
                                        </button>
                                        <button type="button"
                                                className="btn btn-info"
                                                onClick={()=>{
                                                    let discount = prompt('Enter value discount in %');
                                                    setCommercialDisc(discount);
                                                    editCost({type:'Commercial',discount})
                                                }}
                                        >discount
                                        </button>
                                        <button type="button"
                                                className="btn btn-danger col-12"
                                                onClick={()=>{deleteCost({type:'Commercial'})}}
                                        >delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                            <li className={`${extendCommercial.length?'d-block':'d-none'}`}>
                                <div className="container-inputs d-flex">

                                    <div className="form-group col-7 pl-0">
                                        <div className="current-cost d-flex">
                                            <label htmlFor="extentCom-cost" className="pt-2 pr-2">Extended Commercial</label>
                                            <input
                                                id="extentCom-cost"
                                                type="text"
                                                className="form-control"
                                                value={extendCommercial}
                                                name="Extended Commercial"
                                                onChange={e=>setExtendCom(e.target.value)}
                                            />
                                            <p className="mb-0 pt-2 pl-2">$</p>
                                        </div>

                                        <div className="cost-discount d-flex">
                                            <label htmlFor="extentdCom-desc" className="pt-2 pr-2">Disc. price</label>
                                            <input
                                                id="extentdCom-desc"
                                                type="text"
                                                readOnly={true}
                                                className="form-control col-4"
                                                value={discount(extendCommercialDisc,extendCommercial)}

                                            />
                                            <p className="mb-0 pt-2 pl-2">{extendCommercialDisc}%</p>
                                        </div>
                                    </div>
                                    <div className="btn-group flex-wrap" role="group" aria-label="Basic example">
                                        <button type="button"
                                                className="btn btn-primary"
                                                onClick={()=>{
                                                    editCost({type:'Extended Commercial',cost:extendCommercial})
                                                }}
                                        >
                                            edit
                                        </button>
                                        <button type="button"
                                                className="btn btn-info"
                                                onClick={()=>{
                                                    let discount = prompt('Enter value discount in %');
                                                    setExtendComDisc(discount);
                                                    editCost({type:'Extended Commercial',discount})
                                                }}
                                        >discount
                                        </button>
                                        <button type="button"
                                                className="btn btn-danger col-12"
                                                onClick={()=>{deleteCost({type:'Extended Commercial'})}}
                                        >delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                            <li className={`${free.length?'d-block':'d-none'}`}>
                                <div className="container-inputs d-flex">

                                    <div className="col-7">
                                        <p>Free  &nbsp;&nbsp;0 $</p>
                                    </div>

                                    <div className="btn-group flex-wrap col-5" role="group" aria-label="Basic example">
                                      
                                         <button type="button"
                                            className="btn btn-danger mt-0 col-12"
                                            onClick={()=>{deleteCost({type:'Free'})}}
                                    >delete
                                    </button>
                                    </div>

                                </div>



                            </li>
                        </ul>
                    </div>


                </form>
            </div>
            <div className="create-cost-froms col-6">
                <form>

                    <div className="form-group cost-form">
                        <h3>Create Cost</h3>
                        <ul className="pl-0 pt-3">
                            <li className={`${personal.length?'d-none':'d-block'}`}>
                                <div className="container-inputs d-flex">
                                    <div className="form-check pt-2 col-6">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="personal-cost"
                                            checked={btnCheck.Personal}
                                            onChange={(e)=>setCheck({...btnCheck, Personal: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="personal-cost">
                                            Personal
                                        </label>
                                    </div>
                                    <div className="form-group col-4 d-flex">

                                        <input

                                            type="text"
                                            className="form-control mb-0 align-items-center"
                                            value={crtCost.Personal}
                                            name="Personal"
                                            onChange={e=>setCrtCost({...crtCost, [e.target.name]:e.target.value })}
                                        />
                                        <p className="mb-0 pt-2 pl-2">$</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!btnCheck.Personal}
                                        onClick={()=>{
                                            createCost({type:'Personal', cost:crtCost.Personal});
                                            setCheck({...btnCheck, Personal: false});
                                            setCrtCost({...crtCost, ['Personal']:'' })
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </li>
                            <li className={`${commercial.length?'d-none':'d-block'}`}>
                                <div className="container-inputs d-flex">
                                    <div className="form-check pt-2 col-6">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="commercial-cost"
                                            checked={btnCheck.Commercial}
                                            onChange={(e)=>setCheck({...btnCheck, Commercial: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="commercial-cost">
                                            Commercial
                                        </label>
                                    </div>
                                    <div className="form-group col-4 d-flex mb-0 align-items-center">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={crtCost.Commercial}
                                            name="Commercial"
                                            onChange={e=>setCrtCost({...crtCost, [e.target.name]:e.target.value })}
                                        />
                                        <p className="mb-0 pt-2 pl-2">$</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!btnCheck.Commercial}
                                        onClick={()=>{
                                            createCost({type:'Commercial', cost:crtCost.Commercial});
                                            setCheck({...btnCheck, Commercial: false})
                                            setCrtCost({...crtCost, ['Commercial']:'' })
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </li>
                            <li className={`${extendCommercial.length?'d-none':'d-block'}`}>
                                <div className="container-inputs d-flex">
                                    <div className="form-check pt-2 col-6 d-flex">
                                        <input
                                            className="form-check-input position-relative"
                                            type="checkbox"
                                            id="extended-cost"
                                            checked={btnCheck.ExtendedCommercial}
                                            onChange={(e)=>setCheck({...btnCheck, ExtendedCommercial: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="extended-cost">
                                            Extended Commercial
                                        </label>
                                    </div>
                                    <div className="form-group col-4 d-flex">
                                        <input
                                            type="text"
                                            className="form-control mb-0 align-items-center"
                                            value={crtCost.ExtendedCommercial}
                                            name="Extended Commercial"
                                            onChange={e=>setCrtCost({...crtCost, ['ExtendedCommercial']:e.target.value })}
                                        />
                                        <p className="mb-0 pt-2 pl-2">$</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!btnCheck.ExtendedCommercial}
                                        onClick={()=>{
                                            createCost({type:'Extended Commercial', cost:crtCost.ExtendedCommercial})
                                            setCheck({...btnCheck, ExtendedCommercial: false})
                                            setCrtCost({...crtCost, ['ExtendedCommercial']:'' })
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </li>
                            <li className={`${free.length?'d-none':'d-block'}`}>
                                <div className="container-inputs d-flex">
                                    <div className="form-check pt-2 col-8">
                                        <input
                                            className="form-check-input mb-0 align-items-center"
                                            type="checkbox"
                                            id="personal-cost"
                                            checked={btnCheck.Free}
                                            onChange={(e)=>setCheck({...btnCheck, Free: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="personal-cost">
                                            Free
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-success ml-2"
                                        disabled={!btnCheck.Free}
                                        onClick={()=>{
                                            createCost({type:'Free', cost:'0'})
                                            setCheck({...btnCheck, Free: false})
                                            setCrtCost({...crtCost, ['Free']:'' })
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
               
               .edit-cost-forms li{
                    margin: 10px 0px;
                    border-bottom: 1px solid;
                    padding: 10px 0px;
               }
               
               .edit-cost-forms li .btn-danger{
                    border-radius: 3px;
                    margin-top:5px;
               }
               
               .edit-cost-forms li .btn-info{
                    border-top-right-radius:3px;
                    border-bottom-right-radius:3px;
                   
               }
               
               .edit-cost-forms .current-cost,
               .edit-cost-forms .cost-discount{
                    margin: 5px 0px;
                }
                
                .container-inputs .form-check-label{
                    align-items: center;
                    display: flex;
                    width: 100%;
                    padding-left: 10px;
                   
                }

                .container-inputs button{
                    margin-top:20px;
                }
             
               
                
            `
            }</style>
            </div>
    )
}

function TagList({product, checkErrors}){

    const [formVisible, setFormVisible] = useState(false);
    const [tagName, setTagName] = useState('');
    const [tags, setTags] = useState(null);
    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();
    const inputEl = useRef(null);
    const [allTags, setTagList] = useState(null);
    const selectionInp = useRef(null);
    const [selectValue, setValue] = useState('Choose...');

    useEffect(()=>{
        if(product!==null&&product.tags!==null){
           if(product.tags){
               setTags(product.tags);
           }
            getTagList();
        }
    }, [product]);

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

            await request(`${process.env.API_URL}/api/admin/products/addTag/${product.id}`, 'POST', body, {
                Authorization: `Bearer ${token}`
            }).then(()=>{
                for(let tag of allTags){
                    if(tag.title===selectValue){
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

        await request(`${process.env.API_URL}/api/admin/products/tag/${product.id}`, 'POST', body, {
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
        }).then(async(result)=>{
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

    if(loading){
        return(<PreloaderComp />)
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

function Files({product, AlertSuccess, checkErrors}){

    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();
    const [images, setNewImage] = useState(null);
    const file = useRef(null);
    const [main, setMain] = useState(null);

    useEffect(()=>{
        if(product!==null && product.Images){
            setNewImage(product.Images);

            if(product.Images.filter(item=>item.main).length){
                setMain(product.Images.filter(item=>item.main)[0].id);
            }

        }
    }, [product]);


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

        xhr.open('POST', `${process.env.API_URL}/api/admin/products/image/${product.id}`, true);
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

        await request(`${process.env.API_URL}/api/admin/products/imagemain/${id}/${product.id}`,'PUT',null, {
            Authorization: `Bearer ${token}`
        }).then(result=>{
            console.log(result)
        }).catch(err=>{
            console.log(err.message)
        })

    }

    if(loading){
        return(<PreloaderComp />)
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

function Categories({product, AlertSuccess, checkErrors}){



    const [categories, setCategories] = useState([]);
    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();
    const [selectCat, setSelect] = useState('');


    useEffect(()=>{
        if(product!==null){
            if(!categories.length){
                getCategories();
            }
            if(product.categories && product.categories.id){
                setSelect(product.categories.title)
            }
        }
    }, [product])

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
        await request(`${process.env.API_URL}/api/admin/products/${product.id}`,  'PUT', body, {
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

    if(loading){
        return(<PreloaderComp />)
    }


    return(
        <div className="mt-5">

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
