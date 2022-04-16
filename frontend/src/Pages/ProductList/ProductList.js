import React, {Fragment, useEffect} from 'react';
import "./ProductList.css";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Sidebar from "../../Components/Sidebar/Sidebar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link, useNavigate} from "react-router-dom";
import {admin_products as products} from "../../data";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import {clearErrors, deleteProduct, getAdminProduct} from "../../actions/productAction";
import {DELETE_PRODUCT_RESET} from "../../constants/productConstants";

const ProductList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const alert = useAlert();

    const { error, products } = useSelector((state) => state.products);

    const { error: deleteError, isDeleted } = useSelector(
        (state) => state.product
    );

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Product Deleted Successfully");
            navigate("/admin/dashboard");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAdminProduct());
    }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
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
                    <Fragment>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() =>
                                deleteProductHandler(params.getValue(params.id, "id"))
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];

    products &&
        products.forEach((item)=>{
            rows.push({
                id: item._id,
                stock: item.Stock,
                price: item.price,
                name: item.name
            })
        })
    return (
        <Fragment>
            <Header/>
            <div className="dashboard">
                <Sidebar/>
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                        autoWidth
                    />
                </div>
            </div>
            <Footer/>
        </Fragment>
    );
};

export default ProductList;