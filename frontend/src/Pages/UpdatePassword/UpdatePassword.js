import React, {Fragment, useState, useEffect} from 'react';
import "./UpdatePassword.css";
import Header from "../../Components/Header/Header";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Loader from "../../Components/Loader/Loader";
import {useSelector, useDispatch} from "react-redux";
import {clearErrors, updatePassword} from "../../actions/userAction";
import {useAlert} from "react-alert";
import {useNavigate} from "react-router-dom";
import {UPDATE_PASSWORD_RESET} from "../../constants/userConstants";

const UpdatePassword = () => {
    const dispatch=useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {error, isUpdated, loading} = useSelector((state)=>state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(updatePassword(myForm));
    };

    useEffect(()=>{
        if (error){
            alert.error(error);
            dispatch(clearErrors);
        }

        if(isUpdated){
            alert.success("Password Updated Successfully");
            navigate("/account");
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [dispatch, error, alert, navigate, isUpdated]);
    return (
        <Fragment>
            {loading ? (
                <Loader/>
            ) : (
                <Fragment>
                    <Header/>
                    <div className="update_password_wrapper">
                        <div className="update_password_container">
                            <div className="update_password_heading">
                                <h3>Update Password</h3>
                            </div>
                            <form
                                className="update_password_form"
                                encType="multipart/form-data"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="old_password">
                                    <VpnKeyIcon/>
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e)=>setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className="new_password">
                                    <LockOpenIcon/>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e)=>setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="confirm_password">
                                    <LockIcon/>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e)=>setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update Password"
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdatePassword;