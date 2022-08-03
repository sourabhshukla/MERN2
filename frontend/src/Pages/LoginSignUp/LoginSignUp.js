import React, {useEffect, useRef, useState} from 'react';
import Header from "../../Components/Header/Header";
import "./LognSignUp.css";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FaceIcon from '@mui/icons-material/Face';
import {Link, useLocation} from "react-router-dom";
import {useNavigate} from "react-router";
import Profile from "../../images/Profile.png";
import {useDispatch, useSelector} from "react-redux";
import {clearErrors, login, register} from "../../actions/userAction";
import {useAlert} from "react-alert";
import Loader from "../../Components/Loader/Loader";


const LoginSignUp = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation();
    const {loading, error, isAuthenticated} = useSelector((state) => state.user);
    const alert = useAlert();

    const [buttonStatus,setButtonStatus]=useState(0);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState(Profile);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });
    const {name, email, password}=user;
    const login_button=useRef(null);
    const register_button=useRef(null);
    const login_form=useRef(null);
    const register_form=useRef(null);

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    useEffect(()=>{
        if(error && error!=="Please Login to access this resource"){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated){
            navigate(redirect);
        }
    },[dispatch,error,alert,isAuthenticated,navigate,redirect]);

    const loginSubmit = (e) => {
        e.preventDefault();
        //console.log("Form Submitted");
        dispatch(login(loginEmail,loginPassword));
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("password",password);
        myForm.set("avatar", avatar);
        dispatch(register(myForm));
    }

    const registerDataChange = (e) => {
        if (e.target.name==="avatar"){
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }

            reader.readAsDataURL(e.target.files[0]);
        }
        else{
            setUser({...user, [e.target.name]: e.target.value})
        }
    }

    function toggleLoginRegisterBtn() {
        if(buttonStatus===0){
            setButtonStatus(1);
            login_button.current.style.borderBottomColor="transparent";
            login_button.current.style.color="black";
            login_form.current.style.display="none";
            register_button.current.style.borderBottomColor="tomato";
            register_button.current.style.color="tomato";
            register_form.current.style.display="flex";
        }
        else if(buttonStatus===1){
            setButtonStatus(0);
            login_button.current.style.borderBottomColor="tomato";
            login_button.current.style.color="tomato";
            login_form.current.style.display="flex";
            register_button.current.style.borderBottomColor="transparent";
            register_button.current.style.color="black";
            register_form.current.style.display="none";
        }
    }

    return (
        <>
            {loading?<Loader/>:(
                <>
                    <Header/>
                    <div className="login_signup_wrapper">
                        <div className="login_signup_container">
                            <div className="login_signup_buttons">
                                <div className="login_button" ref={login_button} onClick={toggleLoginRegisterBtn}>LOGIN</div>
                                <div className="register_button" ref={register_button} onClick={toggleLoginRegisterBtn}>REGISTER</div>
                            </div>
                            <form className="login_form" ref={login_form} onSubmit={loginSubmit}>
                                <div className="login_email">
                                    <MailOutlineIcon/>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        value={loginEmail}
                                        onChange={(e)=>setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="login_password">
                                    <LockOpenIcon/>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={loginPassword}
                                        onChange={(e)=>setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Link to="/password/forgot">Forgot Password ?</Link>
                                <input type="submit" value="Login" className="loginBtn"/>
                            </form>
                            <form
                                className="register_form"
                                ref={register_form}
                                encType="multipart/form-data"
                                onSubmit={registerSubmit}
                            >
                                <div className="register_name">
                                    <FaceIcon/>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="register_email">
                                    <MailOutlineIcon/>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="register_password">
                                    <LockOpenIcon/>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        name="password"
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="register_image">
                                    <img src={avatarPreview} alt=""/>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Register"
                                    className="signUpBtn"
                                    // disabled={loading ? true : false}
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default LoginSignUp;