import React, {Fragment} from 'react';
import "./ConfirmOrder.css";
import Header from "../../Components/Header/Header";
import {cartItems} from "../../data";
import CheckoutSteps from "../../Components/CheckoutSteps/CheckoutSteps";
import {Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import {useSelector} from "react-redux";

const ConfirmOrder = () => {
    const navigate = useNavigate();
    const {shippingInfo, cartItems} = useSelector((state)=>state.cart);
    const {user} = useSelector((state) => state.user);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity*item.price,0
    )
    // const shippingInfo = {
    //     address: "34B KAMLA NEHRU NAGAR",
    //     city: "INDORE",
    //     state: "Madhya Pradesh",
    //     country: "INDIA",
    //     pinCode: 452001,
    //     phoneNo: 123456789
    //
    // }
    // const user = {
    //     name: "Sourabh Shukla"
    // }
    //const subtotal=1000;
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    const tax=subtotal*0.18;
    const totalPrice=subtotal+tax+shippingCharges;
    const address=`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        };

        sessionStorage.setItem("orderInfo", JSON.stringify(data));
        navigate("/process/payment");
    }

    return (
        <Fragment>
            <Header/>
            <div className="checkout-steps">
                <CheckoutSteps activeStep={1} />
            </div>
            <div className="confirmOrderPage">
                <div>
                    <div className="confirmShippingArea">
                        <Typography>Shipping Info</Typography>
                        <div className="confirmShippingAreaBox">
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>
                        </div>
                    </div>
                    <div className="confirmCartItems">
                        <Typography>Your Cart Items:</Typography>
                        <div className="confirmCartItemContainer">
                            {cartItems &&
                              cartItems.map((item)=>(
                                  <div key={item.product}>
                                      <img src={item.image} alt="Product"/>
                                      <Link to={`/product/${item.product}`}>
                                          {item.name}
                                      </Link>
                                      <span>
                                          {item.quantity} X ₹{item.price} = {" "}
                                          <b>₹{item.price * item.quantity}</b>
                                      </span>
                                  </div>
                              ))}
                        </div>
                    </div>
                </div>
            {/*      */}
                <div>
                    <div className="orderSummary">
                        <Typography>Order Summary</Typography>
                        <div>
                            <div>
                                <p>Subtotal</p>
                                <span>₹{subtotal}</span>
                            </div>
                            <div>
                                <p>Shipping Charges</p>
                                <span>₹{shippingCharges}</span>
                            </div>
                            <div>
                                <p>GST</p>
                                <span>₹{tax}</span>
                            </div>
                        </div>

                        <div className="orderSummaryTotal">
                            <p>
                                <b>Total:</b>
                            </p>
                            <span>₹{totalPrice}</span>
                        </div>
                        <button onClick={proceedToPayment}>Proceed to Payment</button>
                    </div>
                </div>
            </div>
            {/*<Footer/>*/}
        </Fragment>
    );
};

export default ConfirmOrder;