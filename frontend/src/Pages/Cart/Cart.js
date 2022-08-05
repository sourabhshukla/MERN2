import React, {Fragment} from 'react';
import "./Cart.css";
import Header from "../../Components/Header/Header";
import CartItemCard from "../../Components/CartItemCard/CartItemCard";
import Footer from "../../Components/Footer/Footer";
import {cartItems} from "../../data";
import { Typography } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import {Link, useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {addItemsToCart, removeItemsFromCart} from "../../actions/cartAction";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {cartItems} = useSelector((state)=>state.cart);
    const {isAuthenticated} = useSelector((state)=>state.user);

    const increaseQuantity = (id,quantity,stock) => {
        const newQty = quantity+1;
        if (stock <= quantity){
            return;
        }
        dispatch(addItemsToCart(id,newQty));
    }

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity-1;
        if (1>=quantity){return;}
        dispatch(addItemsToCart(id,newQty));
    }

    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const checkoutHandler = () => {
        if (isAuthenticated){
            navigate("/shipping");
        }
        else if(isAuthenticated===false) {
            navigate("/login");
        }
    }
    const item={
        product: "productID",
        price: "200",
        name: "abhi",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1416339698674-4f118dd3388b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=436&q=80",
    }
    return (
        <Fragment>
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <RemoveShoppingCartIcon />
                    <Typography>No Product in Your Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>
            ) : (
                <Fragment>
                    <Header/>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {cartItems && cartItems.map((item)=>(
                            <div className="cartContainer" key={item.product}>
                                <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
                                <div className="cartInput">
                                    <button
                                        onClick={()=>decreaseQuantity(item.product, item.quantity)}
                                    >-</button>
                                    <input type="number" value={item.quantity} readOnly/>
                                    <button
                                        onClick={()=>increaseQuantity(item.product,item.quantity,item.stock)}
                                    >+</button>
                                </div>
                                <p className="cartSubtotal">{`₹${item.price*item.quantity}`}</p>
                            </div>
                        ))}

                        <div className="cartGrossProfit">
                            <div></div>  {/*// for filling grid template columns*/}
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(
                                    (acc,item) => acc+item.quantity*item.price,0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                    {/*<Footer/>*/}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Cart;