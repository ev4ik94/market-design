import {useState, useEffect, useRef} from 'react'
import MainLayout from '../../components/MainLayout';
import useHttp from '../../hooks/http.hook';
import {decrypt} from "../../components/secondary-functions";
import {useAuth} from "../../hooks/auth.hook";
import NavUsers from '../../components/user/navUser';
import {Preloader} from "../../components/Preloader";
import classes from '../../styles/views/user.module.css'




export default function User({users:serverUser, serverError}) {

    const {request, loading, error} = useHttp();
    const [mount, setMount] = useState(true);
    const {token, userId, email} = useAuth();
    const [toggleForm, setFormToggle] = useState(false);
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorC, setError] = useState('');

    const changeForm = useRef(null);

    const toggleChangePass = (form)=>{

        let elem = document.getElementsByClassName('form-change-pass')[0];
        if(form){
            elem.style = `height:${changeForm.current.offsetHeight+70}px`;
        }else{
            elem.style = `height:''`;
        }

        setFormToggle(!toggleForm)
    };

    useEffect(()=>{

        if(mount){
            if(!serverUser){
                if(token && token!==null){
                    getUser();
                }
            }
            else{
                if(serverError===null){
                    setName(serverUser.data.name!==null?serverUser.data.name:'');
                    setSurName(serverUser.data.last_name!==null?serverUser.data.last_name:'');
                }
            }
            setMount(false);
        }

    }, [mount])

    useEffect(()=>{
        if(serverError!==null && serverError===404){
            window.location.href= `${process.env.API_URL}/404`;
        }
    }, [serverError])

    const getUser = async()=>{
        await request(`${process.env.API_URL}/api/users/${userId}`)
            .then(result=>{
                if(result.data){
                    setName(result.data.name!==null?result.data.name:'');
                    setSurName(result.data.last_name!==null?result.data.last_name:'');
                }
            })
    }
    const updateUser = async()=>{

        const body = {
            name,
            last_name:surName
        }
        let err = false;

        if(password!==''){
            if(password===passwordConfirm){
                setError('');
                err = false;
                body.password = password;
            }else{
                err = true;
                setError('The specified passwords do not match.');
            }
        }

        if(!err){
            await request(`${process.env.API_URL}/api/users/${userId}`, 'PUT', body, {
                Authorization: `Bearer ${token}`
            })
                .then(()=>{
                    setError('');
                    setPassword('');
                    setPasswordConfirm('');
                })
                .catch(err=>setError(err.message))
        }



    }

    if(loading){
        return(<Preloader />)
    }




    return (
        <MainLayout title={'Title'}>
            {
                token && token!==null?(
                    <>
                        <NavUsers />
                        <div className="container">
                            <div className={`${classes['title-head']}`}>
                                <h1 className="font-weight-bold text-center text-uppercase">{email && email!==null?email:''}</h1>
                            </div>
                            {
                                errorC!==''?(<div className='error-message mb-3'>
                                    <p className="text-center mb-0">{errorC}</p>
                                </div>):''
                            }
                            <div className={`${classes['form-user-content']} mt-5 col-lg-6 col-md-6 col-12`}>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="nameUserContent">name</label>
                                        <input type="text"
                                               className="form-control"
                                               id="nameUserContent"
                                               aria-describedby="emailHelp"
                                               value={name}
                                               onChange={(e)=>setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="surNameUserContent">surname</label>
                                        <input type="text"
                                               className="form-control"
                                               id="surNameUserContent"
                                               value={surName}
                                               onChange={(e)=>setSurName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group readOnlyInp">
                                        <label htmlFor="mailContentUser">e-mail address *</label>
                                        <input type="text" className="form-control" id="mailContentUser" placeholder={email && email!==null?email:''} readOnly/>
                                    </div>

                                </form>
                                <button className={`text-uppercase float-right ${classes['change-pass-btn']}`} onClick={()=>toggleChangePass(!toggleForm)}>change password</button>
                                <div className={`${classes['form-change-pass']} form-change-pass mt-5`}>

                                    <form ref={changeForm}>
                                        <div className="form-group">
                                            <label htmlFor="newPass">new password</label>
                                            <input type="password"
                                                   className={`form-control ${errorC!==''?`isError`:''}`}
                                                   id="newPass"
                                                   aria-describedby="emailHelp"
                                                   value={password}
                                                   onChange={(e)=>setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPass">confirm new password</label>
                                            <input type="password"
                                                   className={`form-control ${errorC!==''?`isError`:''}`}
                                                   id="confirmPass"
                                                   value={passwordConfirm}
                                                   onChange={(e)=>setPasswordConfirm(e.target.value)}
                                            />
                                        </div>

                                    </form>
                                </div>
                                <button className={`${classes['btn']} text-uppercase`} onClick={updateUser}>save</button>
                            </div>
                        </div>
                    </>
                ):(<div style={{minHeight:'400px'}}>
                    <div className={`${classes['title-head']} col-6 mx-auto`}>
                        <h1 className="font-weight-bold text-center mb-0 mt-5">ACCESS DENIED</h1>
                    </div>
                    <p className="text-center mt-3">You are not authorized to access this page.</p>
                </div>)
            }

        </MainLayout>
    )
}


export async function getServerSideProps(ctx){

    if(ctx.req.headers.cookie){
        let cookie = ctx.req.headers.cookie.split(';').filter(item=>item.indexOf('users')>0);
        let ind = cookie.length && cookie[0].indexOf('=')>0?cookie[0].indexOf('='):null;

        if(cookie.length && ind!==null){
            let users = decrypt(cookie[0].slice(ind+1));

            const response = await fetch(`${process.env.API_URL}/api/users/${users.userId}`).catch(err=>console.log(err.message))

            if(!response.ok){
                return {
                    props:{users:null, serverError:response.status}
                }
            }
            const user = await response.json();

            return {
                props:{users:user, serverError:null}
            }
        }

    }
    return {
        props:{users:null, serverError:'error'}
    }


}


