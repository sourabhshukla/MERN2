import React, {Fragment, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import man from "../../images/man.png";
import "./Profile.css";
import Header from "../../Components/Header/Header";
import {useSelector} from "react-redux";
import Loader from "../../Components/Loader/Loader";

const Profile = () => {
    // const user={
    //     name: "Sourabh Shukla",
    //     email: "sourabhshukla9893502147@gmail.com",
    //     avatar: {
    //         url:{man}
    //     },
    //     createdAt:"2021-08-31T13.22.31.210Z"
    // }
    const navigate = useNavigate();
    const {loading, isAuthenticated, user} = useSelector((state) => state.user);
    const [profilePic, setProfilePic] = useState({man});
    const [User, setUser] = useState({
        name: "Sourabh Shukla",
        email: "sourabhshukla9893502147@gmail.com",
        avatar: {
            url:{man}
        },
        createdAt:"2021-08-31T13.22.31.210Z"
    });
    useEffect(()=>{
        if (!isAuthenticated){
            // navigate('/login');
            setProfilePic("https://i.stack.imgur.com/l60Hf.png");
        }
        else {
            setProfilePic(user.avatar.url.toString());
            setUser(user);
        }
    },[isAuthenticated,navigate,user,User])
    return (
        <Fragment>
            {loading ? (
                <Loader/>
            ) : (
                <Fragment>
                    <Header/>
                    <div className="profileContainer">
                        <div>
                            <h1>My Profile</h1>
                            <img src={User.avatar.url} alt={User.name}/>
                            <Link to="/me/update">Edit Profile</Link>
                        </div>
                        <div>
                            <div>
                                <h4>Full Name</h4>
                                <p>{User.name}</p>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>{User.email}</p>
                            </div>
                            <div>
                                <h4>Joined On</h4>
                                <p>{String(User.createdAt).substr(0,10)}</p>
                            </div>

                            <div>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/password/update">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Profile;