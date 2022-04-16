import React, {Fragment, useState, useEffect} from 'react';
import Header from "../../Components/Header/Header";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import "./ResetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../../Components/Loader/Loader";


const ResetPassword = ({match}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {token} = useParams();

    const {error,success,loading} = useSelector(
        (state) => state.forgotPassword
    );

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("password", password);
        myForm.set("confirmPassword",confirmPassword);

        dispatch(resetPassword(token, myForm));
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(success){
            alert.success("Password Updated Successfully");
            navigate("/login");
        }
    },[dispatch, error, alert, navigate, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader/>
            ) : (
                <Fragment>
                    <Header/>
                    <div className="reset_password_wrapper">
                        <div className="reset_password_container">
                            <div className="reset_password_heading">
                                <h3>Reset Password</h3>
                            </div>
                            <form
                                className="reset_password_form"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div className="new_reset_password">
                                    <LockOpenIcon/>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="confirm_reset_password">
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
                                    className="resetPasswordBtn"
                                    value="Change Password"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ResetPassword;