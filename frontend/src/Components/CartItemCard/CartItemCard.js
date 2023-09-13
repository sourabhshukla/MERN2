import React from 'react';
import "./CartItemCard.css";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

const CartItemCard = ({item,deleteCartItems}) => {
    return (
        <div className="CartItemCard">
            <img src={item.image} alt="ssa"/>
            <div>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>{`Price: ₹${item.price}`}</span>
                <DeleteIcon onClick={() => deleteCartItems(item.product)} className="DeleteIcon"/>
                {/*<p>Remove</p>*/}
            </div>
        </div>
    );
};

export default CartItemCard;