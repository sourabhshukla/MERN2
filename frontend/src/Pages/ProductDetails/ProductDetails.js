import React, {Fragment} from 'react';
import Header from "../../Components/Header/Header";
import SingleProduct from "../../Components/SingleProduct/SingleProduct";
import Footer from "../../Components/Footer/Footer";
import Loader from "../../Components/Loader/Loader";
import {useSelector} from "react-redux";

const ProductDetails = () => {
    const {loading} = useSelector((state)=>state.productDetails)
    return (
       <Fragment>
           {loading ? <Loader/> : (
               <Fragment>
                   <Header/>
                   <SingleProduct/>
                   <Footer/>
               </Fragment>
           )}
       </Fragment>
    );
};

export default ProductDetails;