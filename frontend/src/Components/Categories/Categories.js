import React, {Fragment, useEffect} from 'react';
import "./Categories.css";
import {categories} from "../../data";
import {useSelector,useDispatch} from "react-redux";
import {getProduct} from "../../actions/productAction";

const Categories = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getProduct());
    },[dispatch]);
    return (
       <Fragment>
           <div className="categories_container">
               <div className="categories_heading_container">
                   <div className="categories_heading">
                       <h1>ALL CATEGORIES</h1>
                   </div>
               </div>
                   <div className="product_categories">
                       {categories.map((category,index)=>(
                           <div className="category_container" key={index}>
                               <img src={category.src} alt=""/>
                               <h3>{category.title}</h3>
                           </div>
                           ))}
                   </div>
                </div>
       </Fragment>
    );
};

export default Categories;