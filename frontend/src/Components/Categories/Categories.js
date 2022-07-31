import React, {Fragment, useEffect} from 'react';
import "./Categories.css";
import {categories} from "../../data";
import {useSelector,useDispatch} from "react-redux";
import {getProduct} from "../../actions/productAction";
import {Link, useNavigate} from "react-router-dom";

const Categories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                           <Link to="/products" state={{category2: `${category.title}`}}>
                               <div className="category_container" key={index}>
                                   <img src={category.src} alt=""/>
                                   <h3>{category.title}</h3>
                               </div>
                           </Link>
                           ))}
                   </div>
                </div>
       </Fragment>
    );
};

export default Categories;