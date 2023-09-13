import React, {Fragment, useEffect} from 'react';
import "./OrderDetails.css";
import {Typography} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {cartItems as orderItems} from "../../data";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import {clearErrors} from "../../actions/userAction";
import {getOrderDetails} from "../../actions/orderAction";
import Loader from "../../Components/Loader/Loader";

const OrderDetails = () => {

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const {id} = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(getOrderDetails(id));
    }, [dispatch, alert, error, id]);
    // const order={
    //     _id: "SKPRGR58G24H8YJ3S4R",
    //     user: {
    //         name: "Sourabh"
    //     },
    //     shippingInfo: {
    //         address: "34B KAMLA NEHRU NAGAR",
    //         city: "INDORE",
    //         state: "Madhya Pradesh",
    //         country: "INDIA",
    //         pinCode: 452001,
    //         phoneNo: 123456789
    //     },
    //     paymentInfo: {
    //         status: "succeeded"
    //     },
    //     totalPrice: 3000,
    // }
    return (
       <Fragment>
           {loading ? <Loader/> : (
               <Fragment>
                   <Header/>
                   <div className="orderDetailsPage">
                       <div className="orderDetailsContainer">
                           <Typography component="h1">
                               Order #{order && order._id}
                           </Typography>
                           <Typography>Shipping Info</Typography>
                           <div className="orderDetailsContainerBox">
                               <div>
                                   <p>Name:</p>
                                   <span>{order.user && order.user.name}</span>
                               </div>

                               <div>
                                   <p>Phone:</p>
                                   <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                               </div>

                               <div>
                                   <p>Address:</p>
                                   <span>
                                {order.shippingInfo&&
                                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                            </span>
                               </div>
                           </div>

                           <Typography>Payment</Typography>
                           <div className="orderDetailsContainerBox">
                               <div>
                                   <p
                                       className={
                                           order.paymentInfo &&
                                           order.paymentInfo.status === "succeeded"
                                               ? "greenColor"
                                               : "redColor"
                                       }
                                   >
                                       {order.paymentInfo &&
                                       order.paymentInfo.status==="succeeded"
                                           ? "PAID"
                                           : "NOT PAID"}
                                   </p>
                               </div>

                               <div>
                                   <p>Amount: </p>
                                   <span>{order.totalPrice && order.totalPrice}</span>
                               </div>
                           </div>

                           <Typography>Order Status</Typography>
                           <div className="orderDetailsContainerBox">
                               <div>
                                   <p
                                       className={
                                           order.orderStatus && order.orderStatus
                                               ? "greenColor"
                                               : "redColor"
                                       }
                                   >
                                       {order.orderStatus && order.orderStatus}
                                   </p>
                               </div>
                           </div>
                       </div>

                       <div className="orderDetailsCartItems">
                           <Typography>Order Items:</Typography>
                           <div className="orderDetailsCartItemsContainer">
                               {orderItems &&
                                   orderItems.map((item) => (
                                       <div key={item.product}>
                                           <img src={item.image} alt="Product"/>
                                           <Link to={`/product/${item.product}`}>
                                               {item.name}
                                           </Link>
                                           <span>
                                      {item.quantity} X ₹{item.price} ={" "}
                                               <b>₹{item.price*item.quantity}</b>
                                  </span>
                                       </div>
                                   ))}
                           </div>
                       </div>
                   </div>
                   {/*<Footer/>*/}
               </Fragment>
           )}
       </Fragment>
    );
};

export default OrderDetails;