import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Avatar from '@mui/material/Avatar';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import "./Header.css";
import {useSelector, useDispatch} from "react-redux";
import {useAlert} from "react-alert";
import {logout} from "../../actions/userAction";

const Header = () => {
    const [icon,setIcon] = useState(0);
    const [menu, setMenu] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [profilePic, setProfilePic] = useState("https://i.stack.imgur.com/l60Hf.png");
    const account_menu=useRef(null);
    const input_bar=useRef(null);
    const input_bar2=useRef(null);
    const sidenav=useRef(null);
    const {isAuthenticated, user} = useSelector(state => state.user);
    let navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    function orders(){
        navigate("/orders");
    }

    function account() {
        navigate("/account");
    }

    function logoutUser(){
        dispatch(logout());
        alert.success("Logged Out Successfully");
    }

    function dashboard(){
        navigate("/admin/dashboard");
    }

    function loginUser() {
        navigate("/login");
    }

    const options = [
        {icon: <ListAltIcon/>, name: "Orders", func: orders},
        {icon: <PersonIcon/>, name: "Profile", func: account},
        {icon: <ExitToAppIcon/>, name: isAuthenticated ? "LogOut" : "Login", func: isAuthenticated ? logoutUser : loginUser}
    ];

    if(isAuthenticated && user.role === "admin"){
        options.unshift({
            icon: <DashboardIcon/>, name: "Dashboard", func: dashboard
        });
    }

    useEffect(()=>{
        if(isAuthenticated){
            setProfilePic(user.avatar.url.toString());
        }
        else{
            setProfilePic("https://i.stack.imgur.com/l60Hf.png");
        }
    },[isAuthenticated, profilePic]);

    const onAvatarClick=()=>{
        setMenu(!menu);
        //console.log("entered");
        account_menu.current.classList.toggle('active');
    }

    const onSearchClick=()=>{
        if(input_bar2.current.style.display==="flex")
        input_bar2.current.style.display="none";
        else{
            input_bar2.current.style.display="flex";
        }
    }
    const onClearClick=()=>{
        input_bar.current.value='';
    }

    const onMenuClick=()=>{
        if (icon===0){
            setIcon(1);
            sidenav.current.style.left="0";
        }
        else {
            setIcon(0);
            sidenav.current.style.left="-300px";
        }
    }
    const onCartClick = () =>{
        navigate("/cart");
    }
    const gotoHome=()=>{
        navigate("/");
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();

        if(keyword.trim()){
            console.log(keyword);
            navigate(`/products/${keyword}`);
        }
        else{
            navigate(`/products`);
        }
    }

    return (
        <Fragment>
        <header>
            <div className="header_container">
                <div className="header_left">
                    <div className="hamburger" onClick={onMenuClick}>
                        {
                            // icon===0?<MenuIcon/>:<ClearIcon/>
                        }
                    </div>
                    <h2 onClick={gotoHome}>ECOMMERCE</h2>
                </div>

                <div className="header_right">
                    <SearchIcon id="searchIcon" onClick={onSearchClick}/>
                    <form onSubmit={searchSubmitHandler}>
                    <div className="header_search_container active" id="main_search_bar">
                        <SearchIcon id="searchIcon2"/>

                            <input
                                type="text"
                                ref={input_bar}
                                placeholder="Search a Product..."
                                onChange={(e)=>setKeyword(e.target.value)}
                            />

                        <ClearIcon id="clearIcon" onClick={onClearClick}/>
                    </div>
                    </form>
                    <Link to="/products" id="all-products-span">All Products</Link>
                    <ShoppingCartOutlinedIcon id="cartIcon" onClick={onCartClick}/>
                    <Avatar onClick={onAvatarClick} src={profilePic}  id="avatar" sx={{ width: 35, height: 35 }}/>

                </div>
            </div>

            <form onSubmit={searchSubmitHandler}>
            <div className="header_search_container1" ref={input_bar2} id="dropdown_search_bar">
                <SearchIcon/>

                    <input
                        type="text"
                        placeholder="Search a Product..."
                        onChange={(e)=>setKeyword(e.target.value)}
                    />

                <ClearIcon/>
            </div>
            </form>

            <div className="account_menu"  ref={account_menu} style={{display: menu ? 'flex' : 'none'}}>
                <ul>
                    {options.map((item) => (
                        <li onClick={item.func}>{item.icon}<span>{item.name}</span></li>
                    ))}
                    {/*<li onClick={test}><DashboardIcon/><span>Dashboard</span> </li>*/}
                    {/*<li><PersonIcon/><span>My Account</span></li>*/}
                    {/*<li><ExitToAppIcon/><span>Log Out</span> </li>*/}
                    {/*<li><ListAltIcon/><span>My Orders</span> </li>*/}
                </ul>
            </div>
        </header>

            <div className="sidenav" id="mySidenav" ref={sidenav}>
                <ul className="sidenav-menu">
                    {/*<li><a href="#" className="closeBtn" onClick="closeNav()">&times;</a></li>*/}
                    <li className="sidenav-item"><a href="#">Home</a></li>
                    <li className="sidenav-item"><a href="#">About</a></li>
                    <li className="sidenav-item"><a href="#">Products</a></li>
                    <li className="sidenav-item"><a href="#">Orders</a></li>
                    <li className="sidenav-item"><a href="#">My Account</a></li>
                    <li className="sidenav-item"><a href="#">Contact</a></li>
                </ul>
            </div>
        </Fragment>
    );
};

export default Header;