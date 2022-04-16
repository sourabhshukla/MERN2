import React, {Fragment, useEffect, useState} from 'react';
import Header from "../../Components/Header/Header";
import FaceIcon from '@mui/icons-material/Face';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Profile from "../../images/Profile.png";
import "./UpdateProfile.css";
import {useDispatch, useSelector} from "react-redux";
import {clearErrors, loadUser, register, updateProfile} from "../../actions/userAction";
import {useAlert} from "react-alert";
import {useNavigate} from "react-router-dom";
import {UPDATE_PROFILE_RESET} from "../../constants/userConstants";
import Loader from "../../Components/Loader/Loader";

const UpdateProfile = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { user } = useSelector((state)=>state.user);
    const { error, isUpdated, loading } = useSelector((state)=>state.profile);

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState(Profile);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const updateProfileSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("avatar", avatar);
        dispatch(updateProfile(myForm));
    }

    const updateProfileDataChange = (e) => {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }

            reader.readAsDataURL(e.target.files[0]);
    }

    useEffect(()=>{
        if (user){
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated){
            alert.success("Profile Updated Successfully");
            dispatch(loadUser());

            navigate("/account");

            dispatch({
                type: UPDATE_PROFILE_RESET
            });
        }
    },[dispatch,error,alert,isUpdated,navigate, user]);

    return (
        <Fragment>
            {loading ? <Loader/> : (
                <Fragment>
                    <Header/>
                    <div className="update_profile_wrapper">
                        <div className="update_profile_container">
                            <div className="update_profile_heading">
                                <h2>Update Profile</h2>
                            </div>
                            <form
                                encType="multipart/form-date"
                                className="update_profile_form"
                                onSubmit={updateProfileSubmit}
                            >
                                <div className="update_name">
                                    <FaceIcon/>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e)=>setName(e.target.value)}
                                    />
                                </div>
                                <div className="update_email">
                                    <MailOutlineIcon/>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="update_profile_image">
                                    <img src={avatarPreview} alt=""/>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="updateProfileBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdateProfile;