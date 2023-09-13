import React, {Fragment, useEffect} from 'react';
import "./Dashboard.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Doughnut,Line} from "react-chartjs-2";
import Chart from 'chart.js/auto'
import {getAdminProduct} from "../../actions/productAction";
import {getAllOrders} from "../../actions/orderAction";
import {getAllUsers} from "../../actions/userAction";

const Dashboard = () => {
    const dispatch = useDispatch();

    const { products } = useSelector((state) => state.products);

    const { orders } = useSelector((state) => state.allOrders);

    const { users } = useSelector((state) => state.allUsers);
    let outOfStock = 0;

    products &&
    products.forEach((item) => {
        if (item.Stock === 0) {
            outOfStock += 1;
        }
    });

    useEffect(() => {
        dispatch(getAdminProduct());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    let totalAmount = 0;
    orders &&
    orders.forEach((item) => {
        totalAmount += item.totalPrice;
    });

    const lineState = {
        labels: ["Initial Amount","Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: "tomato",
                hoverBackgroundColor: "rgb(197,72,49)",
                data: [0, totalAmount]
            }
        ]
    }

    const doughnutState = {
        labels: ["Out of Stock", "inStock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4","#6800B4"],
                hoverBackgroundColor: ["#4b5000","#35014f"],
                data: [outOfStock, products.length - outOfStock]
            }
        ]
    }
    return (
        <Fragment>
            <Header/>
            <div className="dashboard">
                <Sidebar/>

                <div className="dashboardContainer">
                    <Typography component="h1">Dashboard</Typography>

                    <div className="dashboardSummary">
                        <div>
                            <p>
                                Total Amount <br/> ₹{totalAmount}
                            </p>
                        </div>

                        <div className="dashboardSummaryBox2">
                            <Link to="/admin/products">
                                <p>Products</p>
                                <p>{products && products.length}</p>
                            </Link>
                            <Link to="/admin/orders">
                                <p>Orders</p>
                                <p>{orders && orders.length}</p>
                            </Link>
                            <Link to="/admin/users">
                                <p>Users</p>
                                <p>{users && users.length}</p>
                            </Link>
                        </div>
                    </div>

                    <div className="lineChart">
                        <Line data={lineState}/>
                    </div>

                    <div className="doughnutChart">
                        <Doughnut data={doughnutState}/>
                    </div>
                </div>
            </div>
            {/*<Footer/>*/}
        </Fragment>
    );
};

export default Dashboard;