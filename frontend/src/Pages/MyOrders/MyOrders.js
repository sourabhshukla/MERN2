import React, {Fragment, useEffect} from 'react';
import "./MyOrders.css";
import { DataGrid } from '@mui/x-data-grid';
import LaunchIcon from '@mui/icons-material/Launch';
import {Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {orders} from "../../data";
import Header from "../../Components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import {myOrders,clearErrors} from "../../actions/orderAction";
import Loader from "../../Components/Loader/Loader";

const MyOrders = () => {
    const dispatch = useDispatch();

    const alert = useAlert();

    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);
    // const user={
    //     name: "Sourabh Shukla"
    // }
    const columns=[
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 300,
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.3
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id, "id")}`}>
                        <LaunchIcon/>
                    </Link>
                )
            }
        }
    ];
    const rows=[];

    orders &&
        orders.forEach((item,index)=>{
            rows.push({
                itemsQty: item.itemQty,
                id: item._id,
                status: item.orderStatus,
                amount: item.totalPrice,
            })
        })

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(myOrders());
    }, [dispatch, alert, error]);


    return (
       <Fragment>
           {loading ? <Loader/> : (
               <Fragment>
                   <Header/>
                   <div className="myOrdersPage">
                       <DataGrid
                           rows={rows}
                           columns={columns}
                           pageSize={10}
                           disableSelectionOnClick
                           className="myOrdersTable"
                           autoHeight
                       />

                       <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
                   </div>
               </Fragment>
           )}
       </Fragment>
    );
};

export default MyOrders;