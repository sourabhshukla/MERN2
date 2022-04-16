import logo from './logo.svg';
import './App.css';
import Header from "./Components/Header/Header";
import React, {useEffect, useState} from "react";
import Home from "./Pages/Home/Home";
import {
    Routes,
    Route
} from "react-router-dom";
import AllProducts from "./Pages/AllProducts/AllProducts";
import LoginSignUp from "./Pages/LoginSignUp/LoginSignUp";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Profile from "./Pages/Profile/Profile";
import UpdateProfile from "./Pages/UpdateProfile/UpdateProfile";
import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Cart from "./Pages/Cart/Cart";
import Shipping from "./Pages/Shipping/Shipping";
import ConfirmOrder from "./Pages/ConfirmOrder/ConfirmOrder";
import Payment from "./Pages/Payment/Payment";
import OrderSuccess from "./Pages/OrderSuccess/OrderSuccess";
import MyOrders from "./Pages/MyOrders/MyOrders";
import OrderDetails from "./Pages/OrderDetails/OrderDetails";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProductList from "./Pages/ProductList/ProductList";
import NewProduct from "./Pages/NewProduct/NewProduct";
import store from "./store";
import {loadUser} from "./actions/userAction";
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import axios from "axios";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import UpdateProduct from "./Pages/UpdateProduct/UpdateProduct";
import OrderList from "./Pages/OrderList/OrderList";
import ProcessOrder from "./Pages/ProcessOrder/ProcessOrder";
import UsersList from "./Pages/UsersList/UsersList";
import UpdateUser from "./Pages/UpdateUser/UpdateUser";
import ProductReviews from "./Pages/ProductReviews/ProductReviews";
import NotFound from "./Pages/NotFound/NotFound";

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
      <>
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
          </Routes>
      </>
    </div>
  );
}

export default App;
