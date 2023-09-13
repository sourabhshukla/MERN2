import React, {Fragment, useEffect, useRef} from 'react';
import "./Payment.css";
import CheckoutSteps from "../../Components/CheckoutSteps/CheckoutSteps";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Header from "../../Components/Header/Header";
import {Typography} from "@mui/material";
import Footer from "../../Components/Footer/Footer";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import {CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";
import {clearErrors, createOrder} from "../../actions/orderAction";
import {emptyCart} from "../../actions/cartAction";

const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const alert = useAlert();
    const stripe=useStripe();
    const elements=useElements();
    const payBtn=useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;

                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };

                    dispatch(createOrder(order));
                    dispatch(emptyCart());

                    navigate("/success");
                } else {
                    alert.error("There's some issue while processing payment ");
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            console.log(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error, alert]);


    // const orderInfo={
    //     totalPrice: 2000
    // }
    return (
        <Fragment>
            <Header/>
            <div className="checkout-steps">
                <CheckoutSteps activeStep={2}/>
            </div>
            <div className="paymentContainer">
                <form
                    className="paymentForm"
                    onSubmit={(e)=>submitHandler(e)}
                >
                    <Typography>Card info</Typography>
                    <div>
                        <CreditCardIcon/>
                        <CardNumberElement className="paymentInput"/>
                    </div>
                    <div>
                        <EventIcon/>
                        <CardExpiryElement className="paymentInput"/>
                    </div>
                    <div>
                        <VpnKeyIcon/>
                        <CardCvcElement className="paymentInput"/>
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className="paymentFormBtn"
                    />
                </form>
            </div>
            {/*<Footer/>*/}
        </Fragment>
    );
};

export default Payment;