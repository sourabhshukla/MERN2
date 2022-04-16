import React, {Fragment, useEffect, useState} from 'react';
import Header from "../../Components/Header/Header";
import EmailIcon from '@mui/icons-material/Email';
import "./ForgotPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../../Components/Loader/Loader";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const {error, message, loading} = useSelector(
        (state) => state.forgotPassword
    );

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit=(e)=>{
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(()=>{
        if (error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (message){
            alert.success(message);
        }
    },[dispatch, error, alert, message]);

    return (
        <Fragment>
            {loading ? (
                <Loader/>
            ) : (
                <Fragment>
                    <Header/>
                    <div className="forgot_password_wrapper">
                        <div className="forgot_password_container">
                            <div className="forgot_password_heading">
                                <h3>Forgot Password</h3>
                            </div>
                            <form
                                className="forgot_password_form"
                                onSubmit={forgotPasswordSubmit}
                            >
                                <div className="forgot_password_email">
                                    <EmailIcon/>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Send Verification Code"
                                    className="forgotPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ForgotPassword;