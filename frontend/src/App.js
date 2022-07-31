import logo from './logo.svg';
import './App.css';
import Header from "./Components/Header/Header";
import React, {useEffect, useState, Suspense, lazy} from "react";
import Home from "./Pages/Home/Home";
import {
    Routes,
    Route
} from "react-router-dom";
import store from "./store";
import {loadUser} from "./actions/userAction";
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import axios from "axios";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
//import AllProducts from "./Pages/AllProducts/AllProducts";
const AllProducts = lazy(()=>import('./Pages/AllProducts/AllProducts'));
// import LoginSignUp from "./Pages/LoginSignUp/LoginSignUp";
const LoginSignUp = lazy(()=>import('./Pages/LoginSignUp/LoginSignUp'));
// import ProductDetails from "./Pages/ProductDetails/ProductDetails";
const ProductDetails = lazy(()=>import('./Pages/ProductDetails/ProductDetails'));
// import Profile from "./Pages/Profile/Profile";
const Profile = lazy(()=>import('./Pages/Profile/Profile'));
// import UpdateProfile from "./Pages/UpdateProfile/UpdateProfile";
const UpdateProfile = lazy(()=>import('./Pages/UpdateProfile/UpdateProfile'));
// import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword";
const UpdatePassword = lazy(()=>import('./Pages/UpdatePassword/UpdatePassword'));
// import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
const ForgotPassword = lazy(()=>import('./Pages/ForgotPassword/ForgotPassword'));
// import ResetPassword from "./Pages/ResetPassword/ResetPassword";
const ResetPassword = lazy(()=>import('./Pages/ResetPassword/ResetPassword'));
// import Cart from "./Pages/Cart/Cart";
const Cart = lazy(()=>import('./Pages/Cart/Cart'));
// import Shipping from "./Pages/Shipping/Shipping";
const Shipping = lazy(()=>import('./Pages/Shipping/Shipping'));
// import ConfirmOrder from "./Pages/ConfirmOrder/ConfirmOrder";
const ConfirmOrder = lazy(()=>import('./Pages/ConfirmOrder/ConfirmOrder'));
// import Payment from "./Pages/Payment/Payment";
const Payment = lazy(()=>import('./Pages/Payment/Payment'));
// import OrderSuccess from "./Pages/OrderSuccess/OrderSuccess";
const OrderSuccess = lazy(()=>import('./Pages/OrderSuccess/OrderSuccess'));
// import MyOrders from "./Pages/MyOrders/MyOrders";
const MyOrders = lazy(()=>import('./Pages/MyOrders/MyOrders'));
// import OrderDetails from "./Pages/OrderDetails/OrderDetails";
const OrderDetails = lazy(()=>import('./Pages/OrderDetails/OrderDetails'));
// import Dashboard from "./Pages/Dashboard/Dashboard";
const Dashboard = lazy(()=>import('./Pages/Dashboard/Dashboard'));
// import ProductList from "./Pages/ProductList/ProductList";
const ProductList = lazy(()=>import('./Pages/ProductList/ProductList'));
// import NewProduct from "./Pages/NewProduct/NewProduct";
const NewProduct = lazy(()=>import('./Pages/NewProduct/NewProduct'));
// import UpdateProduct from "./Pages/UpdateProduct/UpdateProduct";
const UpdateProduct = lazy(()=>import('./Pages/UpdateProduct/UpdateProduct'));
// import OrderList from "./Pages/OrderList/OrderList";
const OrderList = lazy(()=>import('./Pages/OrderList/OrderList'));
// import ProcessOrder from "./Pages/ProcessOrder/ProcessOrder";
const ProcessOrder = lazy(()=>import('./Pages/ProcessOrder/ProcessOrder'));
// import UsersList from "./Pages/UsersList/UsersList";
const UsersList = lazy(()=>import('./Pages/UsersList/UsersList'));
// import UpdateUser from "./Pages/UpdateUser/UpdateUser";
const UpdateUser = lazy(()=>import('./Pages/UpdateUser/UpdateUser'));
// import ProductReviews from "./Pages/ProductReviews/ProductReviews";
const ProductReviews = lazy(()=>import('./Pages/ProductReviews/ProductReviews'));
// import NotFound from "./Pages/NotFound/NotFound";
const NotFound = lazy(()=>import('./Pages/NotFound/NotFound'));

function App() {

    const [stripeApiKey, setStripeApiKey] = useState("");

    async function getStripeApiKey() {
        const {data} = await axios.get("/api/v1/stripeapikey");
        setStripeApiKey(data.stripeApiKey);
    }

    useEffect(()=>{
        store.dispatch(loadUser());
        getStripeApiKey();
    },[]);
  return (
    <div className="App">
      <><Suspense fallback={<div>Please wait...</div>}>
          <Routes>
              <Route path="/" element={<Home/>}/>

              <Route path="/product/:id" element={<ProductDetails/>}/>
              <Route path="/products" element={<AllProducts/>}/>
              <Route path="/products/:keyword" element={<AllProducts/>}/>
              <Route path="/login" element={<LoginSignUp/>}/>
              <Route path="/product" element={<ProductDetails/>}/>
              <Route path="/account" element={<ProtectedRoute/>}>
                  <Route path="/account" element={<Profile/>}/>
              </Route>
              <Route path="/me/update" element={<ProtectedRoute/>}>
                  <Route path="/me/update" element={<UpdateProfile/>}/>
              </Route>
              <Route path="/password/update" element={<ProtectedRoute/>}>
                  <Route path="/password/update" element={<UpdatePassword/>}/>
              </Route>
              <Route path="/password/forgot" element={<ForgotPassword/>}/>
              <Route path="/password/reset/:token" element={<ResetPassword/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/shipping" element={<ProtectedRoute/>}>
                  <Route path="/shipping" element={<Shipping/>}/>
              </Route>
              <Route path="/order/confirm" element={<ProtectedRoute/>}>
                  <Route path="/order/confirm" element={<ConfirmOrder/>}/>
              </Route>

              <Route path="/process/payment" element={<ProtectedRoute/>}>
                  <Route path = "/process/payment" element={ stripeApiKey &&
                      <Elements stripe={loadStripe(stripeApiKey)}> <Payment/> </Elements>}/>
              </Route>

              <Route path="/success" element={<ProtectedRoute/>}>
                  <Route path="/success" element={<OrderSuccess/>}/>
              </Route>
              <Route path="/orders" element={<ProtectedRoute/>}>
                  <Route path="/orders" element={<MyOrders/>}/>
              </Route>
              <Route path="/order/:id" element={<ProtectedRoute/>}>
                  <Route path="/order/:id" element={<OrderDetails/>}/>
              </Route>
              <Route path="/admin/dashboard" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/dashboard" element={<Dashboard/>}/>
              </Route>
              <Route path="/admin/products" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/products" element={<ProductList/>}/>
              </Route>
              <Route path="/admin/product" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/product" element={<NewProduct/>}/>
              </Route>
              <Route path="/admin/product/:id" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/product/:id" element={<UpdateProduct/>}/>
              </Route>
              <Route path="/admin/orders" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/orders" element={<OrderList/>}/>
              </Route>
              <Route path="/admin/order/:id" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/order/:id" element={<ProcessOrder/>}/>
              </Route>
              <Route path="/admin/users" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/users" element={<UsersList/>}/>
              </Route>
              <Route path="/admin/user/:id" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/user/:id" element={<UpdateUser/>}/>
              </Route>
              <Route path="/admin/reviews" isAdmin={true} element={<ProtectedRoute/>}>
                  <Route path="/admin/reviews" element={<ProductReviews/>}/>
              </Route>
              <Route path="*" element={<NotFound/>}/>

          </Routes></Suspense>
      </>
    </div>
  );
}

export default App;

