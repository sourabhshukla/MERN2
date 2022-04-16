import React, {Fragment} from 'react';
import "./OrderSuccess.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Typography} from "@mui/material";
import {Link} from "react-router-dom";

const OrderSuccess = () => {
    return (
        <Fragment>
            <div className="orderSuccess">
                <CheckCircleIcon/>
                <Typography>Your Order has been Placed successfully</Typography>
                <Link to="/orders">View Orders</Link>
            </div>
        </Fragment>
    );
};

export default OrderSuccess;